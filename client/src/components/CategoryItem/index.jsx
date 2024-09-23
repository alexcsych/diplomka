import React from 'react'
import styles from './CategoryItem.module.sass'
import { setCategory } from '../../store/slices/itemSlice'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function CategoryItem ({ categoryId, categoryName, image, setCategory }) {
  const navigate = useNavigate()
  const handleClick = () => {
    setCategory(categoryId)
    navigate('/shop')
  }

  return (
    <div onClick={() => handleClick()}>
      <img className={styles.img} src={`${image}`} alt='CategoryItem' />
      <p className={styles.name}>{categoryName}</p>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  setCategory: categoryId => dispatch(setCategory({ categoryId }))
})

export default connect(null, mapDispatchToProps)(CategoryItem)
