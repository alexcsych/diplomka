require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createHttpError = require('http-errors')
const { User } = require('../models')

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)
const JWT_SECRET = process.env.JWT_SECRET

module.exports.createUser = async (req, res, next) => {
  const { body } = req
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashedPassword = await bcrypt.hash(body.password, salt)
    body.password = hashedPassword
    body.token = jwt.sign(
      {
        userName: body.userName,
        email: body.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    const createdUser = await User.create(body)

    if (!createdUser) {
      return next(createHttpError(400, 'Bad Request'))
    }
    const { password, createdAt, updatedAt, __v, ...rest } = createdUser._doc

    res.status(201).send({ data: { user: rest } })
  } catch (err) {
    next(err)
  }
}

module.exports.loginUser = async (req, res, next) => {
  const { body } = req

  try {
    const foundUser = await User.findOne({ email: body.email }).select(
      '-createdAt -updatedAt -__v'
    )

    if (!foundUser) {
      return next(createHttpError(404, 'User Not Found'))
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      foundUser.password
    )

    if (!isPasswordValid) {
      return next(createHttpError(401, 'Invalid Password'))
    }

    const { password, ...rest } = foundUser._doc

    const JWT_SECRET = process.env.JWT_SECRET
    jwt.verify(rest.token, JWT_SECRET, async err => {
      if (err) {
        rest.token = jwt.sign(
          {
            userName: foundUser.userName,
            email: body.email
          },
          JWT_SECRET,
          { expiresIn: '1h' }
        )

        await User.findOneAndUpdate(
          { email: body.email },
          { token: rest.token }
        )
      }
    })

    res.status(200).send({ data: { user: rest } })
  } catch (err) {
    next(err)
  }
}

module.exports.getUser = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  try {
    const foundUser = await User.findOne({ token: token }).select(
      '-createdAt -updatedAt -__v'
    )

    if (!foundUser) {
      return next(createHttpError(404, 'User Not Found'))
    }

    const { password, ...rest } = foundUser._doc

    res.status(200).send({ data: { user: rest } })
  } catch (err) {
    next(err)
  }
}
