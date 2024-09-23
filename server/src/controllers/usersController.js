require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const createHttpError = require('http-errors')
const { User } = require('../models')
const fs = require('fs')
const path = require('path')

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
        email: body.email,
        isAdmin: body.isAdmin
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
            email: body.email,
            isAdmin: foundUser.isAdmin
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

module.exports.updateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      req.body.password = hashedPassword
    }

    const foundUser = await User.findOne({ token: token })
    let previousImageFilename = null

    if (req.file) {
      req.body = {
        ...req.body,
        userImage: `http://localhost:5000/img/${req.file.filename}`
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { token: token },
      req.body,
      {
        new: true
      }
    ).select('-createdAt -updatedAt -__v')

    if (!updatedUser) {
      return next(createHttpError(404, 'User Not Found'))
    }

    if (req.file && req.file.filename && foundUser && foundUser.userImage) {
      if (
        !foundUser.userImage.startsWith('http://localhost:5000/img/anonym.jpg')
      ) {
        previousImageFilename = foundUser.userImage.split(
          'http://localhost:5000/img/'
        )[1]
        const previousImagePath = path.join(
          __dirname,
          '../../public/images/',
          previousImageFilename
        )

        if (fs.existsSync(previousImagePath)) {
          fs.unlinkSync(previousImagePath)
          console.log(`Previous image ${previousImageFilename} deleted.`)
        }
      }
    }

    const { password, ...rest } = updatedUser._doc
    res.status(200).send({
      data: {
        user: JSON.parse(JSON.stringify(rest)),
        updatedUser: JSON.parse(JSON.stringify(rest))
      }
    })
  } catch (err) {
    next(err)
  }
}
