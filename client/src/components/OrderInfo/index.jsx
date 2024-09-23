import React, { useEffect } from 'react'
import { getOrder } from '../../store/slices/orderSlice'
import { connect } from 'react-redux'
import styles from './OrderInfo.module.sass'
import OrderForm from '../OrderForm'
import { Link } from 'react-router-dom'

function OrderInfo ({ getOrder, isMakeOrder, userData, orders }) {
  useEffect(() => {
    if (userData._id) {
      getOrder(userData._id)
    }
  }, [getOrder, userData])

  return isMakeOrder ? (
    <OrderForm></OrderForm>
  ) : orders.length === 0 ? (
    <div className={styles.orderEmpty}>Orders is empty</div>
  ) : (
    <div className={styles.container}>
      {[...orders].reverse().map(o => {
        return (
          <div className={styles.orderBox} key={o._id}>
            <div className={styles.titleBox}>
              <div className={styles.titleBox}>
                <p>Id:</p>
                <p className={styles.orderId}> {o._id}</p>
              </div>
              <div>{new Date(o.createdAt).toISOString().split('T')[0]}</div>
            </div>
            <div className={styles.textBox}>
              <p>Area:</p>
              <p> {o.area}</p>
            </div>
            <div className={styles.textBox}>
              <p>City:</p>
              <p> {o.city}</p>
            </div>
            <div className={styles.textBox}>
              <p>Branch:</p>
              <p> {o.branch}</p>
            </div>
            <p className={styles.itemsTitle}>Items:</p>
            {o.items.map(i => {
              return (
                <Link
                  to={`/item/${i.item}`}
                  className={styles.itemBox}
                  key={i._id}
                >
                  <div className={styles.imgTitleBox}>
                    <img
                      className={styles.img}
                      src={i.itemImage}
                      alt='itemImage'
                    />
                    <p> {i.itemName}</p>
                  </div>
                  <div className={styles.descriptionBox}>
                    <div className={styles.titleBox}>
                      <p>Amount:</p>
                      <p> {i.amount}</p>
                    </div>
                    <div className={styles.titleBox}>
                      <p>Item Price:</p>
                      <p> {i.itemPrice} ₴</p>
                    </div>
                  </div>
                </Link>
              )
            })}
            <div className={styles.titleBox}>
              <p>Total Sum:</p>
              <p> {o.totalAmount} ₴</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    userData: state.userData.userData,
    orders: state.orderData.orders,
    isMakeOrder: state.orderData.isMakeOrder
  }
}

const mapDispatchToProps = dispatch => ({
  getOrder: id => dispatch(getOrder(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderInfo)
