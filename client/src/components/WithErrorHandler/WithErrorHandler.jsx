import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { nullErrorUser } from '../../store/slices/userSlice'
import { nullErrorCategory } from '../../store/slices/categorySlice'
import { nullErrorItem } from '../../store/slices/itemSlice'

const WithErrorHandler = ({
  children,
  errorUser,
  errorCategory,
  errorItem,
  nullErrorUser,
  nullErrorCategory,
  nullErrorItem
}) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (errorUser || errorCategory || errorItem) {
      nullErrorUser()
      nullErrorCategory()
      nullErrorItem()
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [
    errorUser,
    errorCategory,
    errorItem,
    nullErrorUser,
    nullErrorCategory,
    nullErrorItem,
    navigate
  ])
  return children
}

const mapStateToProps = state => {
  return {
    errorUser: state.userData.error,
    errorCategory: state.categoryData.error,
    errorItem: state.itemData.error
  }
}

const mapDispatchToProps = dispatch => ({
  nullErrorUser: () => dispatch(nullErrorUser()),
  nullErrorCategory: () => dispatch(nullErrorCategory()),
  nullErrorItem: () => dispatch(nullErrorItem())
})

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler)
