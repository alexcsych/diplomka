require('dotenv').config()
const { Rating } = require('../models')

module.exports.getComments = async (req, res, next) => {
  const { item } = req.params
  try {
    const comments = await Rating.find({ item: item }).populate({
      path: 'user',
      select: ['userName', 'userImage']
    })
    console.log('comments :>> ', comments)
    res.status(200).send({ data: { comments: comments } })
  } catch (err) {
    next(err)
  }
}
