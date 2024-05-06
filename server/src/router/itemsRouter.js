const { Router } = require('express')
const { itemsController } = require('../controllers')
const itemsRouter = Router()

itemsRouter
  .route('/getItemsByCategory/:categoryId')
  .get(itemsController.getItemsByCategory)

itemsRouter
  .route('/getFilterByCategory/:categoryId')
  .get(itemsController.getFilterByCategory)

module.exports = itemsRouter
