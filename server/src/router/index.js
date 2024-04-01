const { Router } = require('express')
const usersRouter = require('./usersRouter')

const router = Router()

router.use('/user', usersRouter)

module.exports = router
