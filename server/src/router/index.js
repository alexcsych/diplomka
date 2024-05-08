const { Router } = require('express')
const usersRouter = require('./usersRouter')
const categoriesRouter = require('./categoriesRouter')
const itemsRouter = require('./itemsRouter')
const ratingsRouter = require('./ratingsRouter')

const router = Router()

router.use('/user', usersRouter)
router.use('/category', categoriesRouter)
router.use('/item', itemsRouter)
router.use('/rating', ratingsRouter)

module.exports = router
