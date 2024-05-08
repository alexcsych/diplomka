import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getComments = createAsyncThunk(
  'item/getComments',
  async (id, thunkAPI) => {
    console.log('id :>> ', id)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(
        `http://localhost:5000/api/rating/getComments/${id}`
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    comments: [],
    error: null,
    isFetching: false
  },
  reducers: {
    nullErrorComment (state) {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getComments.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { comments } = action.payload.data
        console.log('comments :>> ', comments)
        state.isFetching = false
        state.comments = [...comments]
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
  }
})

const { reducer, actions } = commentSlice

export const { nullErrorComment } = actions

export default reducer
