require('dotenv').config()
const createHttpError = require('http-errors')
const { Item, Rating } = require('../models')
const { mongoose } = require('mongoose')
const ITEMS_PER_PAGE = 6

module.exports.getItemsByCategory = async (req, res, next) => {
  const { categoryId } = req.params
  const { itemName, fPrice, lPrice, otherFilter, page } = req.query.filter
  const pageNumber = parseInt(page, 10) || 1

  console.log('req.query :>> ', req.query)
  console.log('req.params :>> ', req.params)
  console.log('otherFilter :>> ', otherFilter)

  try {
    const filter = {
      ...(itemName === ''
        ? {}
        : { itemName: { $regex: itemName, $options: 'i' } }),
      ...(fPrice && lPrice
        ? { price: { $gte: parseFloat(fPrice), $lte: parseFloat(lPrice) } }
        : {}),
      type: new mongoose.Types.ObjectId(categoryId)
    }

    if (otherFilter) {
      Object.keys(otherFilter).forEach(key => {
        const values = otherFilter[key].map(value => {
          return !isNaN(Number(value)) ? Number(value) : value
        })
        filter[`params.${key}`] = { $in: values }
      })
    }
    console.log('filter :>> ', filter)

    const totalItemsCount = await Item.countDocuments(filter)
    const maxPage = Math.ceil(totalItemsCount / ITEMS_PER_PAGE)

    const foundItems = await Item.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'item',
          as: 'ratings'
        }
      },
      {
        $addFields: {
          rating: { $avg: '$ratings.rating' }
        }
      },
      { $unset: 'ratings' },
      { $skip: ITEMS_PER_PAGE * (pageNumber - 1) },
      { $limit: ITEMS_PER_PAGE }
    ])
    console.log('foundItems :>> ', foundItems)

    res.status(200).send({ data: { items: foundItems, maxPage } })
  } catch (err) {
    next(err)
  }
}

module.exports.getFilterByCategory = async (req, res, next) => {
  const { categoryId } = req.params
  console.log('req.params :>> ', req.params)
  console.log('categoryId :>> ', categoryId)
  try {
    const items = await Item.find({ type: categoryId }).select('params')

    const uniqueParams = items.reduce((accumulator, currentItem) => {
      const params = currentItem.params
      Object.keys(params).forEach(key => {
        const values = Array.isArray(params[key]) ? params[key] : [params[key]]
        values.forEach(value => {
          accumulator[key] = accumulator[key] || {}
          accumulator[key][value] = (accumulator[key][value] || 0) + 1
        })
      })
      return accumulator
    }, {})

    res.status(200).send({ data: { filter: uniqueParams } })
  } catch (err) {
    next(err)
  }
}

module.exports.getItemById = async (req, res, next) => {
  const { _id } = req.params

  try {
    const item = await Item.findOne({ _id })

    if (!item) {
      return next(createHttpError(404, 'Item not found'))
    }

    const ratings = await Rating.find({ item: _id })
    const rating = ratings.length
      ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length
      : null

    const itemWithRating = {
      ...item.toObject(),
      rating,
      views: ratings.length ? ratings.length : 0
    }

    res.status(200).send({ data: { item: itemWithRating } })
  } catch (err) {
    next(err)
  }
}
