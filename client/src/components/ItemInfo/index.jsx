import React from 'react'
import styles from './ItemInfo.module.sass'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { addToCart, removeFromCart } from '../../store/slices/cartSlice'
import { setIsInCart } from '../../store/slices/itemSlice'
import { useNavigate } from 'react-router-dom'

function ItemInfo ({
  userData,
  addToCart,
  removeFromCart,
  setStep,
  itemInfo,
  isInCart,
  setIsInCart
}) {
  const navigate = useNavigate()
  console.log('isInCart :>> ', isInCart)
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
      <div className={styles.container}>
        <img className={styles.img} src={itemInfo.itemImage} alt='itemImage' />
        <div className={styles.description}>
          <div className={styles.info}>
            <p className={styles.title}>{itemInfo.itemName}</p>
            <div className={styles.rating}>
              <p className={styles.stars}>{stars}</p>
              <p>{itemInfo.views} reviews</p>
            </div>
          </div>
          <div className={styles.buy}>
            <p className={styles.price}>Price {itemInfo.price}₴</p>
            <button
              onClick={async () => {
                if (Object.keys(userData).length === 0) {
                  navigate(`/login`)
                } else {
                  if (!isInCart) {
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
                }
              }}
              className={styles.buyBtn}
            >
              {isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.characteristics}>
        <p className={styles.title}>Characteristics</p>
        <p className={styles.text}>{paramsText}</p>
        <p
          className={styles.view}
          onClick={() => {
            setStep('allInfo')
          }}
        >
          View more
        </p>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    userData: { ...state.userData.userData },
    itemInfo: { ...state.itemData.itemInfo },
    isInCart: state.itemData.itemInfo.isInCart
  }
}

const mapDispatchToProps = dispatch => ({
  setIsInCart: isInCart => dispatch(setIsInCart({ isInCart })),
  addToCart: (user, item) => dispatch(addToCart({ user, item })),
  removeFromCart: (user, item) => dispatch(removeFromCart({ user, item }))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemInfo)
