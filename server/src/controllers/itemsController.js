require('dotenv').config()
// const createHttpError = require('http-errors')
const { Item } = require('../models')
const ITEMS_PER_PAGE = 6

module.exports.getItemsByCategory = async (req, res, next) => {
  const { categoryId } = req.params
  const { itemName, fPrice, lPrice, otherFilter, page } = req.query.filter
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
      type: categoryId
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

    const foundItems = await Item.find(filter, '-createdAt -updatedAt -__v')
      .limit(ITEMS_PER_PAGE)
      .skip(ITEMS_PER_PAGE * (page - 1))

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
