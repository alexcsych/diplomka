const { Router } = require('express')
const ratingsRouter = Router()
const { ratingsController } = require('./../controllers')

ratingsRouter.route('/getComments/:item').get(ratingsController.getComments)
ratingsRouter.route('/').post(ratingsController.addComment)

module.exports = ratingsRouter
