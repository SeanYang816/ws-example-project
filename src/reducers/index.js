import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    initialize: (state, { payload }) => {
        // console.log('Redux store detected')
        state.value = payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { initialize } = rootSlice.actions

export default rootSlice.reducer