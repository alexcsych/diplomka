const { Router } = require('express')
const ratingsRouter = Router()
const { ratingsController } = require('./../controllers')

ratingsRouter.route('/getComments/:item').get(ratingsController.getComments)

module.exports = ratingsRouter
