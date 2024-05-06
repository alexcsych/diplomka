import React from 'react'
import styles from './Category.module.sass'
import CategoryItem from '../CategoryItem'
import { connect } from 'react-redux'
import { getCategory } from '../../store/slices/categorySlice'
import { useEffect } from 'react'

function Category ({ getCategory, categoryData }) {
  useEffect(() => {
    getCategory()
  }, [getCategory])

  return (
    <div className={styles.container}>
      {categoryData.map(category => (
        <div key={category._id} className={styles.categoryItem}>
          <CategoryItem
            categoryId={category._id}
            categoryName={category.categoryName}
            image={`${category.image}`}
          />
        </div>
      ))}
    </div>
  )
}

const mapStateToProps = state => {
  return { categoryData: state.categoryData.categoryData }
}

const mapDispatchToProps = dispatch => ({
  getCategory: () => dispatch(getCategory())
})

export default connect(mapStateToProps, mapDispatchToProps)(Category)
