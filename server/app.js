const express = require('express')
const cors = require('cors')
// const swaggerUi = require('swagger-ui-express')
const { errorHandlers } = require('./src/middleware')
const router = require('./src/router')
// const swaggerDocument = require('./swagger.json')

const app = express()

app.use(cors())

app.use(express.json())
app.use('/img', express.static('./public/images'))
app.use('/api', router)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(errorHandlers.errorHandler)

module.exports = app
