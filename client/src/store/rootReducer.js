import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import categoryReducer from './slices/categorySlice'
import itemReducer from './slices/itemSlice'
import commentReducer from './slices/commentSlice'

const rootReducer = combineReducers({
  userData: userReducer,
  categoryData: categoryReducer,
  itemData: itemReducer,
  commentData: commentReducer
})

export default rootReducer
