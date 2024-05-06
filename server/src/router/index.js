const { Router } = require('express')
const usersRouter = require('./usersRouter')
const categoriesRouter = require('./categoriesRouter')
const itemsRouter = require('./itemsRouter')

const router = Router()

router.use('/user', usersRouter)
router.use('/category', categoriesRouter)
router.use('/item', itemsRouter)

module.exports = router
