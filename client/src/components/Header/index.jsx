import React from 'react'
import styles from './Header.module.sass'
import { Link } from 'react-router-dom'

function Header () {
  return (
    <div className={styles.header}>
      <Link to={`/`} className={styles.name}>
        <img
          src={'/images/owl_icon.jpg'}
          alt='owl_icon'
          className={styles.owlIcon}
        />
        <span className={styles.headerText}>OwlPc</span>
      </Link>
      <div className={styles.headerItem}>
        <Link to={`/login`} className={styles.headerText}>
          Log In
        </Link>
        <Link to={`/signup`} className={styles.headerText}>
          Sign Up
        </Link>
        {/* <svg
          xmlns='http://www.w3.org/2000/svg'
          width='30'
          height='30'
          viewBox='0 0 55 55'
          fill='none'
        >
          <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M38.25 36.7263C35.0249 35.1943 31.307 34.375 27.4999 34.375C22.9597 34.375 18.5463 35.5402 14.9442 37.69C11.7188 39.6149 9.30528 42.233 7.99216 45.2086C7.74899 45.7596 8.09924 46.3735 8.68885 46.4963L19.3391 48.7159C24.7218 49.8377 30.278 49.8377 35.6608 48.7159L38.25 48.1763V44.25H32.0833C30.4265 44.25 29.0833 42.9069 29.0833 41.25C29.0833 39.5931 30.4265 38.25 32.0833 38.25H38.25V36.7263ZM44.25 46.9259L46.311 46.4963C46.9006 46.3735 47.2509 45.7596 47.0077 45.2086C46.8648 44.8847 46.7088 44.565 46.5401 44.25H44.25V46.9259Z'
            fill='white'
          />
          <path
            d='M41.25 32.0834L41.25 50.4167'
            stroke='white'
            stroke-width='2.5'
            stroke-linecap='round'
          />
          <path
            d='M50.4167 41.25L32.0834 41.25'
            stroke='white'
            stroke-width='2.5'
            stroke-linecap='round'
          />
          <circle cx='27.5001' cy='18.3333' r='11.4583' fill='white' />
        </svg> */}
      </div>
    </div>
  )
}

export default Header
