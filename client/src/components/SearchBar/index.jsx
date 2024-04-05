import React from 'react'
import styles from './SearchBar.module.sass'

function SearchBar () {
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <input className={styles.input} type='text' />
        <button className={styles.btn}>Search</button>
      </div>
    </div>
  )
}

export default SearchBar
