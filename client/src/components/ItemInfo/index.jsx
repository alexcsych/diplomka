import React from 'react'
import styles from './ItemInfo.module.sass'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

function ItemInfo ({ setStep, itemInfo }) {
  const paramsText = Object.entries({ ...itemInfo.params })
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        value = value.join(' / ')
      }
      return `${value}`
    })
    .join(' / ')
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < itemInfo.rating) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: 'white' }} />
      )
    } else {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} style={{ color: '#7739c0' }} />
      )
    }
  }
  return (
    <>
      <div className={styles.container}>
        <img className={styles.img} src={itemInfo.itemImage} alt='itemImage' />
        <div className={styles.description}>
          <div className={styles.info}>
            <p className={styles.title}>{itemInfo.itemName}</p>
            <div className={styles.rating}>
              <p className={styles.stars}>{stars}</p>
              <p>{itemInfo.views} reviews</p>
            </div>
          </div>
          <div className={styles.buy}>
            <p className={styles.price}>Price {itemInfo.price}₴</p>
            <button className={styles.buyBtn}>Buy</button>
          </div>
        </div>
      </div>
      <div className={styles.characteristics}>
        <p className={styles.title}>Characteristics</p>
        <p className={styles.text}>{paramsText}</p>
        <p
          className={styles.view}
          onClick={() => {
            setStep('allInfo')
          }}
        >
          View more
        </p>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return { itemInfo: { ...state.itemData.itemInfo } }
}

export default connect(mapStateToProps, null)(ItemInfo)
