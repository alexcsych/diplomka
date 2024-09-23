require('dotenv').config()
const createHttpError = require('http-errors')
const { Item, Rating, Cart, Order } = require('../models')
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
  const { user } = req.query

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
    let data = { item: itemWithRating }
    if (user) {
      const isInCart = await Cart.find({ user: user, item: _id })
      const isInOrder = await Order.findOne({ user, 'items.item': _id })
      data = {
        item: {
          ...itemWithRating,
          isInCart: isInCart.length !== 0,
          isInOrder: !!isInOrder
        }
      }
    }

    res.status(200).send({ data: data })
  } catch (err) {
    next(err)
  }
}

module.exports.getItemById = async (req, res, next) => {
  const { _id } = req.params
  const { user } = req.query

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
    let data = { item: itemWithRating }
    if (user) {
      const isInCart = await Cart.find({ user: user, item: _id })
      const isInOrder = await Order.findOne({ user, 'items.item': _id })
      data = {
        item: {
          ...itemWithRating,
          isInCart: isInCart.length !== 0,
          isInOrder: !!isInOrder
        }
      }
    }

    res.status(200).send({ data: data })
  } catch (err) {
    next(err)
  }
}

module.exports.addItem = async (req, res, next) => {
  req.body = {
    ...req.body,
    params: JSON.parse(req.body.params),
    itemImage: `http://localhost:5000/img/${req.file.filename}`
  }
  try {
    console.log('req.body  :>> ', req.body)
    const createdItem = await Item.create(req.body)
    console.log('createdItem :>> ', createdItem)
    res.status(200).send({ data: { itemInfo: createdItem } })
  } catch (err) {
    next(err)
  }
}

module.exports.changeItem = async (req, res, next) => {
  console.log('req.file :>> ', req.file)
  req.body = {
    ...req.body,
    params: JSON.parse(req.body.params)
  }
  if (req.file && req.file.filename) {
    req.body = {
      ...req.body,
      itemImage: `http://localhost:5000/img/${req.file.filename}`
    }
  }
  try {
    console.log('req.body  :>> ', req.body)
    const { _id, ...rest } = req.body
    const findedItem = await Item.findOne({ _id: _id })
    const updatedItem = await Item.findOneAndUpdate({ _id: _id }, rest, {
      new: true
    })
    if (!updatedItem) {
      return next(createHttpError(404, 'Item Not Found'))
    }
    console.log('updatedItem :>> ', updatedItem)

    if (req.file && req.file.filename && findedItem && findedItem.userImage) {
      previousImageFilename = findedItem.userImage.split(
        'http://localhost:5000/img/'
      )[1]
      const previousImagePath = path.join(
        __dirname,
        '../../public/images/',
        previousImageFilename
      )

      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath)
        console.log(`Previous image ${previousImageFilename} deleted.`)
      }
    }
    const ratings = await Rating.find({ item: _id })
    const rating = ratings.length
      ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length
      : null
    const itemWithRating = {
      ...updatedItem.toObject(),
      rating,
      views: ratings.length ? ratings.length : 0
    }
    res.status(200).send({ data: { updatedItem: itemWithRating } })
  } catch (err) {
    next(err)
  }
}
