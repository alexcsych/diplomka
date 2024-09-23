const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    amount: {
      type: Number,
      min: 1,
      max: 9,
      default: 1
    }
  },
  {
    timestamps: true
  }
)

const Cart = mongoose.model('Cart', Schema)

module.exports = Cart
