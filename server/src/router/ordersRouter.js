const { Router } = require('express')
const ordersRouter = Router()
const { ordersController } = require('./../controllers')

ordersRouter
  .route('/:user')
  .get(ordersController.getOrdersById)
  .post(ordersController.addOrderById)

module.exports = ordersRouter
