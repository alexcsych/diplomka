const mongoose = require('mongoose')
const yup = require('yup')

const EMAIL_VALIDATION_SCHEMA = yup.string().email()

const Schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: v => EMAIL_VALIDATION_SCHEMA.isValidSync(v)
      }
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', Schema)

module.exports = User
