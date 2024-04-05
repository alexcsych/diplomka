import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import categoryReducer from './slices/categorySlice'

const rootReducer = combineReducers({
  userData: userReducer,
  categoryData: categoryReducer
})

export default rootReducer
