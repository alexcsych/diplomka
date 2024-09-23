import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getOrder = createAsyncThunk(
  'order/getOrder',
  async (id, thunkAPI) => {
    console.log('id :>> ', id)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(`http://localhost:5000/api/order/${id}`)
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const addOrder = createAsyncThunk(
  'order/addOrder',
  async ({ id, values }, thunkAPI) => {
    console.log('id :>> ', id)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.post(
        `http://localhost:5000/api/order/${id}`,
        values
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const getNovaPoshtaAreas = createAsyncThunk(
  'order/getNovaPoshtaAreas',
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const data = {
      apiKey: '6fba88b3fe94bcb3ffae11471812479f',
      modelName: 'Address',
      calledMethod: 'getSettlementAreas',
      methodProperties: {}
    }
    try {
      const response = await axios.post(
        'https://api.novaposhta.ua/v2.0/json/',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
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

export const getNovaPoshtaCity = createAsyncThunk(
  'order/getNovaPoshtaCity',
  async ({ AreaRef }, thunkAPI) => {
    console.log('AreaRef :>> ', AreaRef)
    const { rejectWithValue } = thunkAPI
    const data = {
      apiKey: '6fba88b3fe94bcb3ffae11471812479f',
      modelName: 'Address',
      calledMethod: 'getSettlements',
      methodProperties: {
        AreaRef: AreaRef,
        Warehouse: 1,
        Page: 1,
        Limit: 10000
      }
    }
    try {
      const response = await axios.post(
        'https://api.novaposhta.ua/v2.0/json/',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
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

export const getNovaPoshtaBranch = createAsyncThunk(
  'order/getNovaPoshtaBranch',
  async ({ CityName }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const data = {
      apiKey: '6fba88b3fe94bcb3ffae11471812479f',
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityName
      }
    }
    try {
      const response = await axios.post(
        'https://api.novaposhta.ua/v2.0/json/',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
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

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    areas: [],
    cities: [],
    branches: [],
    areasSelected: '',
    citiesSelected: '',
    branchesSelected: '',
    isMakeOrder: false,
    error: null,
    isFetching: false
  },
  reducers: {
    setIsMakeOrder (state, action) {
      state.isMakeOrder = action.payload.isMakeOrder
    },
    nullErrorOrders (state) {
      state.error = null
    },
    setAreasSelected (state, action) {
      state.areasSelected = action.payload.areasSelected
    },
    setCitiesSelected (state, action) {
      state.citiesSelected = action.payload.citiesSelected
    },
    setBranchesSelected (state, action) {
      state.branchesSelected = action.payload.branchesSelected
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getOrder.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        const { orders } = action.payload.data
        console.log('orders :>> ', orders)
        state.isFetching = false
        state.orders = [...orders]
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(getNovaPoshtaAreas.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getNovaPoshtaAreas.fulfilled, (state, action) => {
        console.log('action.payload fulfilled :>> ', action.payload)
        state.isFetching = false
        state.areas = [...action.payload.data]
      })
      .addCase(getNovaPoshtaAreas.rejected, (state, action) => {
        state.isFetching = false
        console.log('action.payload rejected :>> ', action.payload)
        state.error = action.payload.data.errors
      })
      .addCase(getNovaPoshtaCity.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getNovaPoshtaCity.fulfilled, (state, action) => {
        console.log('action.payload fulfilled :>> ', action.payload)
        state.isFetching = false
        state.cities = [...action.payload.data]
      })
      .addCase(getNovaPoshtaCity.rejected, (state, action) => {
        state.isFetching = false
        console.log('action.payload rejected :>> ', action.payload)
        state.error = action.payload.data.errors
      })
      .addCase(getNovaPoshtaBranch.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getNovaPoshtaBranch.fulfilled, (state, action) => {
        console.log('action.payload fulfilled :>> ', action.payload)
        state.isFetching = false
        state.branches = [...action.payload.data]
      })
      .addCase(getNovaPoshtaBranch.rejected, (state, action) => {
        state.isFetching = false
        console.log('action.payload rejected :>> ', action.payload)
        state.error = action.payload.data.errors
      })
      .addCase(addOrder.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        const { order } = action.payload.data
        console.log('addOrder.fulfilled :>> ')
        state.isFetching = false
        console.log('order :>> ', order)
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
  }
})

const { reducer, actions } = orderSlice

export const {
  setIsMakeOrder,
  nullErrorOrder,
  setAreasSelected,
  setCitiesSelected,
  setBranchesSelected
} = actions

export default reducer
