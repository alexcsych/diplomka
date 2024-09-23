import React from 'react'
import styles from './Comment.module.sass'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { setIsInCart } from '../../store/slices/itemSlice'
import { addToCart, removeFromCart } from '../../store/slices/cartSlice'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { addComment, getComments } from '../../store/slices/commentSlice'

function generateStars (rating) {
  const stars = []
  const totalStars = 5

  for (let i = 0; i < totalStars; i++) {
    const starColor = i < rating ? 'white' : '#7739c0'
    stars.push(
      <FontAwesomeIcon key={i} icon={faStar} style={{ color: starColor }} />
    )
  }

  return stars
}

function Comment ({
  itemInfo,
  comments,
  userData,
  setIsInCart,
  addToCart,
  removeFromCart,
  getComments,
  addComment
}) {
  const paramsText = Object.entries({ ...itemInfo.params })
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        value = value.join(' / ')
      }
      return `${value}`
    })
    .join(' / ')

  const commentsArray = Object.values(comments)

  const totalRating = commentsArray.reduce(
    (sum, comment) => sum + comment.rating,
    0
  )
  const averageRating =
    commentsArray.length > 0
      ? (totalRating / commentsArray.length).toFixed(2)
      : 0

  const renderComments = Object.values(comments)
    .reverse()
    .map(comment => (
      <div key={comment._id} className={styles.comment}>
        <div className={styles.commentTitle}>
          <div className={styles.userInfoBox}>
            <img
              className={styles.userImg}
              src={comment.user.userImage}
              alt='userImage'
            />
            <p className={styles.userName}>{comment.user.userName}</p>
          </div>
          <p>{new Date(comment.createdAt).toISOString().split('T')[0]}</p>
        </div>
        <p className={styles.commentStars}>{generateStars(comment.rating)}</p>
        <p className={styles.commentDescription}>{comment.comment}</p>
      </div>
    ))

  return (
    <>
      <h3 className={styles.itemName}>{itemInfo.itemName}</h3>
      <div className={styles.rating}>
        <p className={styles.stars}>{generateStars(averageRating)}</p>
        <p>{commentsArray.length} reviews</p>
      </div>
      <div className={styles.container}>
        <div className={styles.characteristics}>
          {itemInfo.isInOrder && (
            <div className={styles.formBox}>
              <Formik
                initialValues={{
                  rating: 5,
                  comment: ''
                }}
                validationSchema={Yup.object({
                  rating: Yup.number()
                    .required('Rating is required')
                    .min(1, 'Rating must be at least 1')
                    .max(5, 'Rating must be at most 5')
                    .integer('Rating must be an integer'),
                  comment: Yup.string().required('Comment is required')
                })}
                onSubmit={async (values, { resetForm }) => {
                  const body = {
                    ...values,
                    item: itemInfo._id,
                    user: userData._id
                  }
                  console.log('body :>> ', body)
                  // await
                  addComment(body)
                  // await getComments(itemInfo._id)
                  resetForm()
                }}
              >
                <Form className={styles.commentForm}>
                  <div className={styles.textBox}>
                    <label htmlFor='rating'>Rating:</label>
                    <Field type='number' name='rating' />
                    <ErrorMessage
                      className={styles.error}
                      name='rating'
                      component='div'
                    />
                  </div>
                  <div className={styles.textBox}>
                    <label htmlFor='comment'>Comment:</label>
                    <Field as='textarea' name='comment' />
                    <ErrorMessage
                      className={styles.error}
                      name='comment'
                      component='div'
                    />
                  </div>
                  <button type='submit'>Add Comment</button>
                </Form>
              </Formik>
            </div>
          )}
          {renderComments}
        </div>
        <div className={styles.description}>
          <img
            className={styles.itemImage}
            src={itemInfo.itemImage}
            alt='itemImage'
          />
          <p className={styles.text}>{paramsText}</p>
          <div className={styles.buy}>
            <p className={styles.price}>Price {itemInfo.price}₴</p>
            <button
              onClick={async () => {
                if (!itemInfo.isInCart) {
                  console.log(
                    'userData._id, itemInfo._id :>> ',
                    userData._id,
                    itemInfo._id
                  )
                  await addToCart(userData._id, itemInfo._id)
                  setIsInCart(true)
                } else {
                  await removeFromCart(userData._id, itemInfo._id)
                  setIsInCart(false)
                }
              }}
              className={styles.buyBtn}
            >
              {itemInfo.isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    userData: { ...state.userData.userData },
    itemInfo: { ...state.itemData.itemInfo },
    comments: { ...state.commentData.comments }
  }
}

const mapDispatchToProps = dispatch => ({
  getComments: id => dispatch(getComments(id)),
  addComment: body => dispatch(addComment(body)),
  setIsInCart: isInCart => dispatch(setIsInCart({ isInCart })),
  addToCart: (user, item) => dispatch(addToCart({ user, item })),
  removeFromCart: (user, item) => dispatch(removeFromCart({ user, item }))
})

export default connect(mapStateToProps, mapDispatchToProps)(Comment)
