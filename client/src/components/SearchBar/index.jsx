import React from 'react'
import styles from './SearchBar.module.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function SearchBar () {
  return (
    <div className={styles.container}>
      <input className={styles.input} type='text' />
      <button className={styles.btn}>
        <FontAwesomeIcon icon={faSearch} className={styles.icon} />
      </button>
    </div>
  )
}

export default SearchBar
