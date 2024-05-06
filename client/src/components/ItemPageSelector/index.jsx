import React from 'react'
import { connect } from 'react-redux'
import { setPage } from '../../store/slices/itemSlice'
import styles from './ItemPageSelector.module.sass'

function ItemPageSelector ({ page, maxPage, setPage }) {
  return (
    <div className={styles.selector}>
      <div
        onClick={() => {
          if (page > 1) setPage(page - 1)
        }}
      >
        Prev
      </div>
      <p>{`Page ${page} of ${maxPage}`}</p>
      <div
        onClick={() => {
          if (page < maxPage) setPage(page + 1)
        }}
      >
        Next
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    page: state.itemData.page,
    maxPage: state.itemData.maxPage
  }
}

const mapDispatchToProps = dispatch => ({
  setPage: page => dispatch(setPage({ page }))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemPageSelector)
