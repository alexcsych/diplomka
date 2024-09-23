const { Router } = require('express')
const usersRouter = Router()
const { usersController } = require('./../controllers')
const { validators } = require('../middleware')
const { checkToken } = require('../middleware/checkToken')
const upload = require('../middleware/multer')

usersRouter
  .route('/signup')
  .post(validators.validateSignUpData, usersController.createUser)

usersRouter
  .route('/login')
  .post(validators.validateLogInData, usersController.loginUser)

usersRouter.route('/getUser').get(checkToken, usersController.getUser)

usersRouter
  .route('/updateUser')
  .patch(
    checkToken,
    upload.single('userImage'),
    validators.validateUpdateData,
    usersController.updateUser
  )

module.exports = usersRouter
