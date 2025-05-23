import React from 'react'
import Header from '../../components/Header'
import styles from './ProfilePage.module.sass'
import { Link, useParams } from 'react-router-dom'
import ProfileInfo from '../../components/ProfileInfo'
import CartInfo from '../../components/CartInfo'
import OrderInfo from '../../components/OrderInfo'

function ProfilePage () {
  const { pageId } = useParams()
  return (
    <>
      <Header></Header>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.links}>
            <Link
              to={`/profile/info`}
              className={`${styles.link} ${
                pageId === 'info' && styles.activeLink
              }`}
            >
              Profile Info
            </Link>
            <Link
              to={`/profile/cart`}
              className={`${styles.link} ${
                pageId === 'cart' && styles.activeLink
              }`}
            >
              Cart
            </Link>
            <Link
              to={`/profile/order`}
              className={`${styles.link} ${
                pageId === 'order' && styles.activeLink
              }`}
            >
              Orders
            </Link>
          </div>
          {pageId === 'info' ? (
            <ProfileInfo></ProfileInfo>
          ) : pageId === 'cart' ? (
            <>
              <CartInfo></CartInfo>
            </>
          ) : (
            <>
              <OrderInfo></OrderInfo>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ProfilePage
