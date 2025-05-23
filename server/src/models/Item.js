const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  params: {
    type: Object,
    required: true
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: v => v > 0
    }
  },
  itemImage: {
    type: String,
    required: true
  }
})

const Item = mongoose.model('Item', Schema)

module.exports = Item
