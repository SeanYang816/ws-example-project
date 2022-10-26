import { initialize } from "reducers"
import { END, eventChannel } from "redux-saga"
import { actionChannel, call, fork, take, takeEvery } from "redux-saga/effects"

function* testFunc({ type, payload }) {
    yield console.info('Redux Saga is working')
}

function* watchRequests() {
    // actionChannel can buffer incoming messages if the Saga is not yet ready to take them (e.g. blocked on an API call) 
    const requestChan = yield actionChannel(initialize)
    while (true) {
      const { payload } = yield take(requestChan)
      yield call(handleRequest, payload)
    }
  }

function* handleRequest(payload) {
    yield call(countdown, 10)
}

function countdown(secs) {
    return eventChannel(emitter => {
        const iv = setInterval(() => {
          secs -= 1
          console.info(secs)
          if (secs > 0) {
            emitter(secs)
          } else {
            console.info('The World Ends.')
            // this causes the channel to close
            emitter(END)
          }
        }, 1000)
        // The subscriber must return an unsubscribe function
        return () => {
          clearInterval(iv)
        }
      }
    )
  }

export default function* testWatcher() {
    yield fork(watchRequests)
    yield takeEvery(initialize, testFunc)
}