import React from 'react'
import styles from './ShopItem.module.sass'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

function ShopItem ({ item }) {
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < item.rating) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: 'yellow' }} />
      )
    } else {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: 'white' }} />
      )
    }
  }
  return (
    <Link className={styles.link} to={`/item/${item._id}`}>
      <img className={styles.img} src={`${item.itemImage}`} alt='ShopItem' />
      <div className={styles.text}>
        <div className={styles.description}>
          <p className={styles.name}>{item.itemName}</p>
        </div>
        <div className={styles.description}>
          <p className={styles.rating}>{stars}</p>
          <p className={styles.price}>{item.price}₴</p>
        </div>
      </div>
    </Link>
  )
}

export default ShopItem
