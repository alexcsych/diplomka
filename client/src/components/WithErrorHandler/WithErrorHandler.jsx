import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { nullErrorUser } from '../../store/slices/userSlice'
import { nullErrorCategory } from '../../store/slices/categorySlice'
import { nullErrorItem } from '../../store/slices/itemSlice'
import { nullErrorComment } from '../../store/slices/commentSlice'

const WithErrorHandler = ({
  children,
  errorUser,
  errorCategory,
  errorItem,
  nullErrorUser,
  nullErrorCategory,
  nullErrorItem,
  nullErrorComment,
  errorComment
}) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (errorItem && errorItem.status && errorItem.status === 404) {
      nullErrorItem()
      navigate('/')
    } else if (errorUser && errorUser.status === 403) {
      localStorage.removeItem('token')
      navigate('/login')
    } else if (
      (errorUser && errorUser.status !== 400 && errorUser.status !== 404) ||
      errorCategory ||
      errorItem ||
      errorComment
    ) {
      console.log('errorUser :>> ', errorUser)
      nullErrorUser()
      nullErrorCategory()
      nullErrorItem()
      nullErrorComment()
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
    nullErrorComment,
    errorComment,
    navigate
  ])
  return children
}

const mapStateToProps = state => {
  return {
    errorUser: state.userData.error,
    errorCategory: state.categoryData.error,
    errorItem: state.itemData.error,
    errorComment: state.commentData.error
  }
}

const mapDispatchToProps = dispatch => ({
  nullErrorUser: () => dispatch(nullErrorUser()),
  nullErrorCategory: () => dispatch(nullErrorCategory()),
  nullErrorItem: () => dispatch(nullErrorItem()),
  nullErrorComment: () => dispatch(nullErrorComment())
})

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler)
