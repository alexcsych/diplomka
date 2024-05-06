import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const signupUser = createAsyncThunk(
  'user/signup',
  async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/signup',
        userData
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/login',
        userData
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const getUser = createAsyncThunk(
  'user/getUser',
  async (token, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/getUser`,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: {},
    isFetching: false,
    error: null
  },
  reducers: {
    logoutUser (state) {
      state.userData = {}
      localStorage.removeItem('token')
    },
    nullErrorUser (state) {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signupUser.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        const { user } = action.payload.data
        state.isFetching = false
        state.userData = user
        localStorage.setItem('token', user.token)
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(loginUser.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user } = action.payload.data
        state.isFetching = false
        state.userData = user
        console.log('user :>> ', user)
        localStorage.setItem('token', user.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(getUser.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getUser.fulfilled, (state, action) => {
        const { user } = action.payload.data
        state.isFetching = false
        state.userData = user
        console.log('user :>> ', user)
        localStorage.setItem('token', user.token)
      })
      .addCase(getUser.rejected, (state, action) => {
        state.userData = {}
        state.isFetching = false
        state.error = action.payload.data.errors
      })
  }
})

const { reducer, actions } = userSlice

export const { logoutUser, nullErrorUser } = actions

export default reducer
