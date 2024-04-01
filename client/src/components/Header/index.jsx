import React from 'react'
import styles from './Header.module.sass'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutUser } from '../../store/slices/userSlice'

function Header ({ userData, logoutUser }) {
  console.log('userData :>> ', userData)
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
            <span className={styles.headerText}>{userData.userName}</span>
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
  logoutUser: () => dispatch(logoutUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
