import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import categoryReducer from './slices/categorySlice'
import itemReducer from './slices/itemSlice'
import commentReducer from './slices/commentSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'

const rootReducer = combineReducers({
  userData: userReducer,
  categoryData: categoryReducer,
  itemData: itemReducer,
  commentData: commentReducer,
  cartData: cartReducer,
  orderData: orderReducer
})

export default rootReducer
