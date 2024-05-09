import React from 'react'
import styles from './Comment.module.sass'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

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

function Comment ({ itemInfo, comments }) {
  const paramsText = Object.entries({ ...itemInfo.params })
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        value = value.join(' / ')
      }
      return `${value}`
    })
    .join(' / ')
  console.log('itemInfo.params :>> ', itemInfo.params)

  console.log('comments :>> ', comments)
  const renderComments = Object.values(comments).map(comment => (
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
        <p className={styles.stars}>{generateStars(itemInfo.rating)}</p>
        <p>{itemInfo.views} reviews</p>
      </div>
      <div className={styles.container}>
        <div className={styles.characteristics}>{renderComments}</div>
        <div className={styles.descrirtion}>
          <img
            className={styles.itemImage}
            src={itemInfo.itemImage}
            alt='itemImage'
          />
          <p className={styles.text}>{paramsText}</p>
          <div className={styles.buy}>
            <p className={styles.price}>Price {itemInfo.price}₴</p>
            <button className={styles.buyBtn}>Buy</button>
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    itemInfo: { ...state.itemData.itemInfo },
    comments: { ...state.commentData.comments }
  }
}

export default connect(mapStateToProps, null)(Comment)
