import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  getCart,
  removeFromCart,
  updateAmount
} from '../../store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './CartInfo.module.sass'
import { setIsMakeOrder } from '../../store/slices/orderSlice'

function CartInfo ({
  removeFromCart,
  updateAmount,
  userData,
  getCart,
  cart,
  totalSum,
  setIsMakeOrder
}) {
  const navigate = useNavigate()

  useEffect(() => {
    if (userData._id) {
      getCart(userData._id)
    }
  }, [getCart, userData])

  return (
    <div className={styles.container}>
      {cart.length !== 0 ? (
        <div className={styles.cartItemBox}>
          {cart.map(c => {
            return (
              <div
                onClick={() => {
                  navigate(`/item/${c.item}`)
                }}
                className={styles.cartItem}
                key={c._id}
              >
                <div className={styles.flexContainer}>
                  <img
                    className={styles.img}
                    src={c.itemData.itemImage}
                    alt='itemImage'
                  />
                </div>
                <div className={styles.flexTitle}>
                  <p>{c.itemData.itemName}</p>
                  <p className={styles.itemPrice}>{c.itemData.price} ₴</p>
                </div>
                <div className={styles.flexContainer}>
                  <div className={styles.amount}>
                    <button
                      className={styles.amountBtn}
                      onClick={e => {
                        e.stopPropagation()
                        if (c.amount > 1)
                          updateAmount(c.user, c.item, c.amount - 1)
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <p>{c.amount}</p>
                    <button
                      className={styles.amountBtn}
                      onClick={e => {
                        e.stopPropagation()
                        if (c.amount < 9)
                          updateAmount(c.user, c.item, c.amount + 1)
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>

                    <button
                      className={styles.amountBtn}
                      onClick={e => {
                        e.stopPropagation()
                        removeFromCart(c.user, c.item)
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.cartEmpty}>Cart is empty</div>
      )}
      {totalSum !== 0 && (
        <div className={styles.orderBox}>
          <p className={styles.totalSum}>Total Sum: {totalSum} ₴</p>
          <button
            onClick={() => {
              setIsMakeOrder(true)
              navigate(`/profile/order`)
            }}
            className={styles.btn}
          >
            Make Order
          </button>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userData: state.userData.userData,
    cart: state.cartData.cart,
    totalSum: state.cartData.totalSum
  }
}

const mapDispatchToProps = dispatch => ({
  getCart: id => dispatch(getCart(id)),
  updateAmount: (user, item, amount) =>
    dispatch(updateAmount({ user, item, amount })),
  setIsMakeOrder: isMakeOrder => dispatch(setIsMakeOrder({ isMakeOrder })),
  removeFromCart: (user, item) => dispatch(removeFromCart({ user, item }))
})

export default connect(mapStateToProps, mapDispatchToProps)(CartInfo)
