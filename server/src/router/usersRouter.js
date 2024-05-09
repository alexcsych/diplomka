const { Router } = require('express')
const usersRouter = Router()
const { usersController } = require('./../controllers')
const { validators } = require('../middleware')
const { checkToken } = require('../middleware/checkToken')
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'userPhoto-' + uniqueSuffix + extension)
  }
})
const upload = multer({ storage: storage })

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
