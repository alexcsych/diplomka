const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
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
        },
        itemPrice: {
          type: Number,
          required: true,
          validate: {
            validator: v => v > 0
          }
        }
      }
    ],
    phoneNumber: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Order = mongoose.model('Order', Schema)

module.exports = Order
