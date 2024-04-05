const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
})

const Category = mongoose.model('Category', Schema)

module.exports = Category
