import React from 'react'
import Header from '../../components/Header'
import Shop from '../../components/Shop'
import styles from './ShopPage.module.sass'
import FilterShop from '../../components/FilterShop'
import ItemPageSelector from '../../components/ItemPageSelector'

function ShopPage () {
  return (
    <>
      <Header></Header>
      <div className={styles.page}>
        <div className={styles.filterContainer}>
          <FilterShop></FilterShop>
        </div>
        <div className={styles.container}>
          <Shop></Shop>
          <ItemPageSelector></ItemPageSelector>
        </div>
      </div>
    </>
  )
}

export default ShopPage
