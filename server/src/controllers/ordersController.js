require('dotenv').config()
const createHttpError = require('http-errors')
const { Order, Cart } = require('../models')
const { mongoose } = require('mongoose')
module.exports.getOrdersById = async (req, res, next) => {
  const { user } = req.params

  try {
    const orders = await Order.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(user) }
      },
      {
        $lookup: {
          from: 'items',
          localField: 'items.item',
          foreignField: '_id',
          as: 'itemsData'
        }
      },
      {
        $addFields: {
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                $mergeObjects: [
                  '$$item',
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$itemsData',
                          as: 'data',
                          cond: { $eq: ['$$data._id', '$$item.item'] }
                        }
                      },
                      0
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                $mergeObjects: [
                  '$$item',
                  {
                    totalItemPrice: {
                      $multiply: ['$$item.itemPrice', '$$item.amount']
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          user: 1,
          phoneNumber: 1,
          area: 1,
          city: 1,
          branch: 1,
          createdAt: 1,
          items: 1,
          totalAmount: { $sum: '$items.totalItemPrice' }
        }
      }
    ])
    res.status(200).send({ data: { orders: orders } })
  } catch (err) {
    next(err)
  }
}

module.exports.addOrderById = async (req, res, next) => {
  const { user } = req.params
  const { area, city, branch, phoneNumber } = req.body
  console.log('user :>> ', user)
  console.log('req.body :>> ', req.body)

  try {
    const order = new Order({
      user: user,
      area,
      city,
      branch,
      phoneNumber
    })
    const itemsInCart = await Cart.find({ user: user }).populate('item')

    itemsInCart.forEach(async item => {
      order.items.push({
        item: item.item._id,
        amount: item.amount,
        itemPrice: item.item.price
      })
    })
    const orderSaved = await order.save()
    await Cart.deleteMany({ user: user })
    res.status(200).send({ data: { order: orderSaved } })
  } catch (err) {
    next(err)
  }
}
