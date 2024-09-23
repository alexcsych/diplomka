import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const groupSelectedFiltersByCategory = selectedFilter => {
  const groupedFilters = {}

  Object.keys(selectedFilter).forEach(key => {
    const [category, value] = key.split('_')

    if (selectedFilter[key]) {
      if (!groupedFilters[category]) {
        groupedFilters[category] = [value]
      } else {
        groupedFilters[category].push(value)
      }
    }
  })

  return groupedFilters
}

export const getItemsByCategory = createAsyncThunk(
  'item/getItemsByCategory',
  async ({ categoryId, filter }, thunkAPI) => {
    filter.otherFilter = groupSelectedFiltersByCategory(filter.otherFilter)
    console.log('categoryId :>> ', categoryId)
    console.log('filter :>> ', filter)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(
        `http://localhost:5000/api/item/getItemsByCategory/${categoryId}`,
        { params: { filter } }
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const getFilterByCategory = createAsyncThunk(
  'item/getFilterByCategory',
  async (categoryId, thunkAPI) => {
    console.log('categoryId :>> ', categoryId)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(
        `http://localhost:5000/api/item/getFilterByCategory/${categoryId}`
      )
      return response.data
    } catch (err) {
      const errorData = err?.response?.data ?? 'Gateway Timeout'
      const errorStatus = err?.response?.status ?? 504
      return rejectWithValue({ data: errorData, status: errorStatus })
    }
  }
)

export const getItemById = createAsyncThunk(
  'item/getItemById',
  async ({ id, user }, thunkAPI) => {
    console.log('getItemById')
    console.log('id :>> ', id)
    console.log('user :>> ', user)
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.get(
        `http://localhost:5000/api/item/getItemById/${id}`,
        user && {
          params: {
            user: user
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

export const addItem = createAsyncThunk(
  'item/addItem',
  async ({ token, data }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.post(
        `http://localhost:5000/api/item/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data'
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

export const changeItem = createAsyncThunk(
  'item/changeItem',
  async ({ token, data }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/item/`,
        data,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data'
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

const itemSlice = createSlice({
  name: 'item',
  initialState: {
    itemName: '',
    fPrice: 0,
    lPrice: 1000000,
    itemData: [],
    itemInfo: {
      isInCart: false,
      isInOrder: false
    },
    filterData: {},
    selectedFilter: {},
    categoryId: '',
    prevCategoryId: '',
    isFetching: false,
    error: null,
    page: null,
    lastPage: null,
    maxPage: null,
    itemId: null
  },
  reducers: {
    nullErrorItem (state) {
      state.error = null
    },
    nullItemId (state) {
      state.itemId = null
    },
    setIsInCart (state, action) {
      console.log('action.payload :>> ', action.payload)
      state.itemInfo.isInCart = action.payload.isInCart
    },
    setCategory (state, action) {
      state.categoryId = action.payload.categoryId
      state.page = 1
    },
    setPage (state, action) {
      state.page = action.payload.page
    },
    setItemName (state, action) {
      state.itemName = action.payload.itemName
    },
    setFirstPrice (state, action) {
      state.fPrice = parseFloat(action.payload.fPrice)
    },
    setLastPrice (state, action) {
      state.lPrice = parseFloat(action.payload.lPrice)
    },
    selectedFilterChange (state, action) {
      const { key, checked } = action.payload
      state.selectedFilter[key] = checked
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getItemsByCategory.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getItemsByCategory.fulfilled, (state, action) => {
        const { items, maxPage } = action.payload.data
        state.isFetching = false
        state.itemData = items
        state.maxPage = maxPage
        state.lastPage = state.page
      })
      .addCase(getItemsByCategory.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(getFilterByCategory.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getFilterByCategory.fulfilled, (state, action) => {
        const { filter } = action.payload.data
        state.isFetching = false
        state.filterData = filter
        if (state.categoryId !== state.prevCategoryId) {
          state.selectedFilter = Object.keys(filter).reduce((acc, key) => {
            Object.keys(filter[key]).forEach(subKey => {
              acc[`${key}_${subKey}`] = false
            })
            return acc
          }, {})
          state.prevCategoryId = state.categoryId
        }
      })
      .addCase(getFilterByCategory.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(getItemById.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        console.log('getItemById.fulfilled')
        console.log('action.payload.data :>> ', action.payload.data)
        const { item } = action.payload.data
        state.isFetching = false
        state.itemInfo = { ...item }
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(addItem.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(addItem.fulfilled, (state, action) => {
        const { itemInfo } = action.payload.data
        console.log('itemInfo :>> ', itemInfo)
        state.itemId = itemInfo._id
        state.isFetching = false
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
      .addCase(changeItem.pending, state => {
        state.isFetching = true
        state.error = null
      })
      .addCase(changeItem.fulfilled, (state, action) => {
        const { updatedItem } = action.payload.data
        console.log('updatedItem :>> ', {
          ...updatedItem,
          isInCart: state.itemInfo.isInCart,
          isInOrder: state.itemInfo.isInOrder
        })
        state.itemInfo = {
          ...updatedItem,
          isInCart: state.itemInfo.isInCart,
          isInOrder: state.itemInfo.isInOrder
        }
        state.isFetching = false
      })
      .addCase(changeItem.rejected, (state, action) => {
        state.isFetching = false
        state.error = action.payload.data.errors
      })
  }
})

const { reducer, actions } = itemSlice

export const {
  nullErrorItem,
  nullItemId,
  setIsInCart,
  setCategory,
  setPage,
  selectedFilterChange,
  setItemName,
  setFirstPrice,
  setLastPrice
} = actions

export default reducer
