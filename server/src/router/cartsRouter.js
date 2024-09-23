const { Router } = require('express')
const cartsRouter = Router()
const { cartsController } = require('./../controllers')

cartsRouter
  .route('/')
  .post(cartsController.addToCart)
  .patch(cartsController.updateAmount)
  .delete(cartsController.removeFromCart)

cartsRouter.route('/:user').get(cartsController.getCart)

module.exports = cartsRouter
