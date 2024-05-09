import React, { useEffect } from 'react'
import styles from './Header.module.sass'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  getUser,
  logoutUser,
  nullErrorUser
} from '../../store/slices/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faShoppingCart,
  faList
} from '@fortawesome/free-solid-svg-icons'

function Header ({ nullErrorUser, getUser, userData, logoutUser }) {
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getUser(token)
    }
  }, [getUser])
  const navigate = useNavigate()
  return (
    <div className={styles.header}>
      <div
        onClick={() => {
          nullErrorUser()
          navigate('/')
        }}
        className={styles.name}
      >
        <img
          src={'/images/owl_icon.jpg'}
          alt='owl_icon'
          className={styles.owlIcon}
        />
        <h1 className={styles.headerText}>OwlPc</h1>
      </div>
      <div className={styles.headerItem}>
        {!userData.userName ? (
          <>
            <span
              onClick={() => {
                nullErrorUser()
                navigate('/login')
              }}
              className={styles.headerText}
            >
              Log In
            </span>
            <span
              onClick={() => {
                nullErrorUser()
                navigate('/signup')
              }}
              className={styles.headerText}
            >
              Sign Up
            </span>
          </>
        ) : (
          <>
            <Link to={`/profile/info`} className={styles.icon}>
              <FontAwesomeIcon icon={faUser} color='white' />
            </Link>
            <Link to={`/profile/cart`} className={styles.icon}>
              <FontAwesomeIcon icon={faShoppingCart} color='white' />
            </Link>
            <Link to={`/profile/order`} className={styles.icon}>
              <FontAwesomeIcon icon={faList} color='white' />
            </Link>
            <span
              className={styles.headerText}
              onClick={() => {
                nullErrorUser()
                logoutUser()
                navigate('/login')
              }}
            >
              Log Out
            </span>
          </>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return { userData: state.userData.userData }
}

const mapDispatchToProps = dispatch => ({
  nullErrorUser: () => dispatch(nullErrorUser()),
  getUser: token => dispatch(getUser(token)),
  logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
