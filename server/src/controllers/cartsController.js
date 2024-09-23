require('dotenv').config()
const { mongoose } = require('mongoose')
const { Cart } = require('../models')

module.exports.getCart = async (req, res, next) => {
  const { user } = req.params
  try {
    const cartItems = await Cart.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(user) } },
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          as: 'itemData'
        }
      },
      { $unwind: '$itemData' },
      {
        $project: {
          _id: 1,
          user: 1,
          item: 1,
          amount: 1,
          'itemData.itemName': 1,
          'itemData.price': 1,
          'itemData.itemImage': 1
        }
      }
    ])
    console.log('cartItems :>> ', cartItems)
    const totalSum = cartItems.reduce(
      (sum, cartItem) => sum + cartItem.itemData.price * cartItem.amount,
      0
    )

    res.status(200).send({ data: { cart: cartItems, totalSum: totalSum } })
  } catch (err) {
    next(err)
  }
}

module.exports.addToCart = async (req, res, next) => {
  const { user, item } = req.body
  console.log('user, item  :>> ', user, item)
  try {
    const cartItem = await Cart.create({ user, item })
    console.log('cartItem :>> ', cartItem)
    res.status(200).send()
  } catch (err) {
    next(err)
  }
}

module.exports.updateAmount = async (req, res, next) => {
  const { user, item, amount } = req.body
  try {
    const cartItem = await Cart.findOneAndUpdate(
      { user, item },
      { amount },
      {
        new: true
      }
    ).populate('item', 'price')
    console.log('cartItem :>> ', cartItem)
    res.status(200).send({ data: { cartItem: cartItem } })
  } catch (err) {
    next(err)
  }
}

module.exports.removeFromCart = async (req, res, next) => {
  const { user, item } = req.query
  console.log('user, item  :>> ', user, item)
  try {
    const deletedItem = await Cart.deleteOne({ user, item })
    console.log('deletedItem :>> ', deletedItem)
    res.status(200).send({ data: { cartItem: { user, item } } })
  } catch (err) {
    next(err)
  }
}
