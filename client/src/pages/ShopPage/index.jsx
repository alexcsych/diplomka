import React from 'react'
import Header from '../../components/Header'
import Shop from '../../components/Shop'
import styles from './ShopPage.module.sass'
import FilterShop from '../../components/FilterShop'
import ItemPageSelector from '../../components/ItemPageSelector'
import AddItemForm from '../../components/AddItemForm'
import { connect } from 'react-redux'

function ShopPage ({ userData }) {
  return (
    <>
      <Header></Header>
      {userData.isAdmin && (
        <div className={styles.page}>
          <AddItemForm></AddItemForm>
        </div>
      )}
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

const mapStateToProps = state => {
  return { userData: state.userData.userData }
}

export default connect(mapStateToProps)(ShopPage)
