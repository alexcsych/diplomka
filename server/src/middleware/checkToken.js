require('dotenv').config()
const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')

module.exports.checkToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) next(createHttpError(401, 'Unauthorized'))

  jwt.verify(token, JWT_SECRET, err => {
    if (err) next(createHttpError(403, 'Forbidden'))
    req.token = token
    next()
  })
}

module.exports.checkTokenAdmin = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return next(createHttpError(401, 'Unauthorized'))

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) return next(createHttpError(403, 'Forbidden'))
    console.log('decodedToken :>> ', decodedToken)
    const isAdmin = decodedToken.isAdmin

    if (!isAdmin) {
      return next(createHttpError(403, 'Forbidden. Admin rights required.'))
    }
    next()
  })
}
