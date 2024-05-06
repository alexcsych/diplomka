import React from 'react'
import styles from './Shop.module.sass'
import ShopItem from '../ShopItem'
import { connect } from 'react-redux'

function Shop ({ itemData }) {
  return (
    <div className={styles.container}>
      {itemData.map(item => (
        <div key={item._id} className={styles.shopItem}>
          <ShopItem item={item} />
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = state => {
  return { itemData: state.itemData.itemData }
}

export default connect(mapStateToProps, null)(Shop)
