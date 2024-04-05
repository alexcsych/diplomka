const { Router } = require('express')
const { categoriesController } = require('../controllers')
const categoriesRouter = Router()

categoriesRouter.route('/getCategory').get(categoriesController.getCategory)

module.exports = categoriesRouter
