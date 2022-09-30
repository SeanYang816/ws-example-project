import { configureStore } from '@reduxjs/toolkit'
import rootReducer from 'reducers'
import rootSaga from 'sagas/rootSaga'
import createSagaMiddleware from 'redux-saga'

const sagaMiddleware = createSagaMiddleware()
const runSaga = sagaMiddleware.run

export default configureStore({
  reducer: {
    root: rootReducer,
  },
  middleware: () => [sagaMiddleware],
  enhancers:[]
})

runSaga(rootSaga)