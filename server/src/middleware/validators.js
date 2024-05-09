const createError = require('http-errors')
const { signUpSchem, logInSchem, updateDataSchem } = require('../validation')
const fs = require('fs')

const valid = async (req, res, next, schem) => {
  console.log('req.body :>> ', req.body)
  try {
    await schem.validate(req.body, { abortEarly: false })
    next()
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {})
    }
    const validationErrors = error.errors || []
    const customError = createError(
      400,
      'Invalid data. Please check the provided data and try again.'
    )
    customError.validationErrors = validationErrors
    next(customError)
  }
}

module.exports.validateSignUpData = async (req, res, next) => {
  valid(req, res, next, signUpSchem)
}

module.exports.validateLogInData = async (req, res, next) => {
  valid(req, res, next, logInSchem)
}

module.exports.validateUpdateData = async (req, res, next) => {
  valid(req, res, next, updateDataSchem)
}
