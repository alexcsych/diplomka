import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getCategory = createAsyncThunk(
  'category/getCategory',
  async (err, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(
        'http://localhost:5000/api/category/getCategory'
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categoryData: [],
    isFetching: false,
    error: null
  },
  reducers: {
    nullErrorCategory (state) {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getCategory.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        const { categories } = action.payload.data
        console.log('categories :>> ', categories)
        state.isFetching = false
        state.categoryData = categories
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
  }
})

const { reducer, actions } = categorySlice

export const { nullErrorCategory } = actions

export default reducer
