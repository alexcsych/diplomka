const createError = require('http-errors')
const { signUpSchem, logInSchem } = require('../validation')

const valid = async (req, res, next, schem) => {
  console.log('req.body :>> ', req.body)
  try {
    await schem.validate(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const validationErrors = error.errors || []
    const customError = createError(
      400,
      'Invalid data. Please check the provided data and try again.'
    )
    customError.validationErrors = validationErrors
    console.log('customError :>> ', customError)
    next(customError)
  }
}

module.exports.validateSignUpData = async (req, res, next) => {
  valid(req, res, next, signUpSchem)
}

module.exports.validateLogInData = async (req, res, next) => {
  valid(req, res, next, logInSchem)
}
