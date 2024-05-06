import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import categoryReducer from './slices/categorySlice'
import itemReducer from './slices/itemSlice'

const rootReducer = combineReducers({
  userData: userReducer,
  categoryData: categoryReducer,
  itemData: itemReducer
})

export default rootReducer
