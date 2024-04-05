const { Router } = require('express')
const usersRouter = require('./usersRouter')
const categoriesRouter = require('./categoriesRouter')

const router = Router()

router.use('/user', usersRouter)
router.use('/category', categoriesRouter)

module.exports = router
