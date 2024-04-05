require('dotenv').config()
const createHttpError = require('http-errors')
const Category = require('../models/Category')

module.exports.getCategory = async (req, res, next) => {
  try {
    const foundCategories = await Category.find(
      {},
      '-createdAt -updatedAt -__v'
    )
    console.log('foundCategories :>> ', foundCategories)

    if (foundCategories.length === 0) {
      return next(createHttpError(400, 'Bad Request'))
    }

    res.status(200).send({ data: { categories: foundCategories } })
  } catch (err) {
    next(err)
  }
}
