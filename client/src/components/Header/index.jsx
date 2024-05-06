import React, { useEffect } from 'react'
import styles from './Header.module.sass'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUser, logoutUser } from '../../store/slices/userSlice'

function Header ({ getUser, userData, logoutUser }) {
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getUser(token)
    }
  }, [getUser])
  const navigate = useNavigate()
  return (
    <div className={styles.header}>
      <Link to={`/`} className={styles.name}>
        <img
          src={'/images/owl_icon.jpg'}
          alt='owl_icon'
          className={styles.owlIcon}
        />
        <h1 className={styles.headerText}>OwlPc</h1>
      </Link>
      <div className={styles.headerItem}>
        {!userData.userName ? (
          <>
            <Link to={`/login`} className={styles.headerText}>
              Log In
            </Link>
            <Link to={`/signup`} className={styles.headerText}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className={styles.headerName}>{userData.userName}</span>
            <span
              className={styles.headerText}
              onClick={() => {
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
  getUser: token => dispatch(getUser(token)),
  logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
