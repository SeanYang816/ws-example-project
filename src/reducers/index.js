import { createSlice, createAction } from '@reduxjs/toolkit'

export const connectWebSocket = createAction('webSocket/requestWebSocketConnection')

const initialState = {
  value: 0,
}

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    initialize: (state, { payload }) => {
        console.info('Redux store detected')
        state.value = payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { initialize } = rootSlice.actions

export default rootSlice.reducer