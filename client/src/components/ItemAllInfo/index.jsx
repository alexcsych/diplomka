import React from 'react'
import styles from './ItemAllInfo.module.sass'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { setIsInCart } from '../../store/slices/itemSlice'
import { addToCart, removeFromCart } from '../../store/slices/cartSlice'

function formatKey (text) {
  let result = ''
  result += text[0].toUpperCase()
  for (let i = 1; i < text.length; i++) {
    if (text[i] === text[i].toUpperCase() && i !== 0) {
      result += ' ' + text[i].toUpperCase()
    } else {
      result += text[i]
    }
  }
  return result
}

function ItemAllInfo ({
  itemInfo,
  userData,
  setIsInCart,
  addToCart,
  removeFromCart
}) {
  const characteristicsText = Object.entries({ ...itemInfo.params }).map(
    ([key, value]) => {
      if (Array.isArray(value)) {
        value = value.join('/')
      } else if (value === true) {
        value = 'true'
      } else if (value === false) {
        value = 'false'
      }
      return (
        <div className={styles.row} key={key}>
          <span className={styles.rowText}>{formatKey(key)}</span>
          <div className={styles.dots}></div>
          <span className={styles.rowText}>{value}</span>
        </div>
      )
    }
  )
  console.log('itemInfo.params :>> ', itemInfo.params)
  const paramsText = Object.entries({ ...itemInfo.params })
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        value = value.join(' / ')
      } else if (value === true) {
        value = 'true'
      } else if (value === false) {
        value = 'false'
      }
      return `${value}`
    })
    .join(' / ')
  console.log('itemInfo.params :>> ', itemInfo.params)

  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < itemInfo.rating) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: 'white' }} />
      )
    } else {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: '#7739c0' }} />
      )
    }
  }
  return (
    <>
      <h3 className={styles.itemName}>{itemInfo.itemName}</h3>
      <div className={styles.rating}>
        <p className={styles.stars}>{stars}</p>
        <p>{itemInfo.views} reviews</p>
      </div>
      <div className={styles.container}>
        <div className={styles.characteristics}>{characteristicsText}</div>
        <div className={styles.descrirtion}>
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
    itemInfo: { ...state.itemData.itemInfo }
  }
}

const mapDispatchToProps = dispatch => ({
  setIsInCart: isInCart => dispatch(setIsInCart({ isInCart })),
  addToCart: (user, item) => dispatch(addToCart({ user, item })),
  removeFromCart: (user, item) => dispatch(removeFromCart({ user, item }))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemAllInfo)
