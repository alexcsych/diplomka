const { Router } = require('express')
const usersRouter = Router()
const { usersController } = require('./../controllers')
const { validators } = require('../middleware')
const { checkToken } = require('../middleware/checkToken')

usersRouter
  .route('/signup')
  .post(validators.validateSignUpData, usersController.createUser)

usersRouter
  .route('/login')
  .post(validators.validateLogInData, usersController.loginUser)

usersRouter.route('/getUser').get(checkToken, usersController.getUser)

// usersRouter
//   .route('/:_id')
//   .patch(validators.validateUpdateData, usersController.updateUser)

module.exports = usersRouter
