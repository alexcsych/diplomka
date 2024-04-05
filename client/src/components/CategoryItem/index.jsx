import React from 'react'
import styles from './CategoryItem.module.sass'
import { Link } from 'react-router-dom'

function CategoryItem ({ categoryId, categoryName, image }) {
  return (
    <Link to={`/shop?categoryId=${categoryId}`}>
      <img className={styles.img} src={`${image}`} alt='CategoryItem' />
      <p className={styles.name}>{categoryName}</p>
    </Link>
  )
}

export default CategoryItem
