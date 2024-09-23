import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (id, thunkAPI) => {
    console.log('id :>> ', id)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${id}`)
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ user, item }, thunkAPI) => {
    console.log('user, item :>> ', user, item)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.post(`http://localhost:5000/api/cart`, {
        user,
        item
      })
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ user, item }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart`, {
        params: { user, item }
      })
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const updateAmount = createAsyncThunk(
  'cart/updateAmount',
  async ({ user, item, amount }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.patch(`http://localhost:5000/api/cart`, {
        user,
        item,
        amount
      })
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    totalSum: 0,
    error: null,
    isFetching: false
  },
  reducers: {
    nullErrorCart (state) {
      state.error = null
    },
    clearCart (state) {
      state.cart = []
      state.totalSum = 0
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getCart.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getCart.fulfilled, (state, action) => {
        const { cart, totalSum } = action.payload.data
        console.log('cart :>> ', cart)
        state.isFetching = false
        state.totalSum = totalSum
        state.cart = [...cart]
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(addToCart.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, state => {
        state.isFetching = false
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(removeFromCart.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { user, item } = action.payload.data.cartItem
        state.isFetching = false
        state.cart = state.cart.filter(i => {
          if (i.item === item && i.user === user) {
            state.totalSum -= i.itemData.price * i.amount
            return false
          }
          return true
        })
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(updateAmount.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(updateAmount.fulfilled, (state, action) => {
        const { cartItem } = action.payload.data
        state.isFetching = false
        state.cart = state.cart.map(item => {
          if (item.item === cartItem.item._id && item.user === cartItem.user) {
            if (item.amount > cartItem.amount) {
              state.totalSum -= cartItem.item.price
            } else if (item.amount < cartItem.amount) {
              state.totalSum += cartItem.item.price
            }

            return { ...item, amount: cartItem.amount }
          }
          return item
        })
      })
      .addCase(updateAmount.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
  }
})

const { reducer, actions } = cartSlice

export const { nullErrorCart, clearCart } = actions

export default reducer
