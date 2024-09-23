require('dotenv').config()
const { Rating, User } = require('../models')

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

module.exports.addComment = async (req, res, next) => {
  try {
    const newComment = await Rating.create(req.body)
    const user = await User.findById(req.body.user, ['userName', 'userImage'])

    const commentWithUser = {
      ...newComment.toObject(),
      user: user
    }

    console.log('newComment :>> ', commentWithUser)
    res.status(200).send({ data: { comment: commentWithUser } })
  } catch (err) {
    next(err)
  }
}
