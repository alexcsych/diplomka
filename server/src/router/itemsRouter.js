const { Router } = require('express')
const { itemsController } = require('../controllers')
const upload = require('../middleware/multer')
const { checkTokenAdmin } = require('../middleware/checkToken')
const itemsRouter = Router()

itemsRouter
  .route('/getItemsByCategory/:categoryId')
  .get(itemsController.getItemsByCategory)

itemsRouter
  .route('/getFilterByCategory/:categoryId')
  .get(itemsController.getFilterByCategory)

itemsRouter.route('/getItemById/:_id').get(itemsController.getItemById)

itemsRouter
  .route('/')
  .post(checkTokenAdmin, upload.single('itemImage'), itemsController.addItem)
  .patch(
    checkTokenAdmin,
    upload.single('itemImage'),
    itemsController.changeItem
  )

module.exports = itemsRouter
