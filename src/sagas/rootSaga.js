import {CLIENT_ACTIONS} from "constants"
import {isCompositeComponent} from "react-dom/test-utils"
import { initialize, connectWebSocket } from "reducers"
import {eventChannel} from "redux-saga"
import { call, fork, take, takeEvery } from "redux-saga/effects"
import test from 'sagas/testSaga'
import {jsonParser, log, messageCreator} from "utils"
import { v4 as uuid } from 'uuid';

let ws

export const getWs = () => ws

function createEventChannel (ws) {
    return eventChannel((emitter) => {
        const handleEventListener = (e) => {
            // console.log(e)
            emitter(e)
        }
        ws?.addEventListener('message', handleEventListener)
        return () => {
            ws?.removeEventListener('message', handleEventListener)
          }
    })
}

function* createWSMessageReceiver() {
    yield ws = new WebSocket('ws://localhost:1234')
    const sendMessage = message => {
        const command = {
          ...message,
          id: uuid(),
          timestamp: Date.now(),
        }
        return ws.send(JSON.stringify(command))
      }
      ws.onopen = (e) => {
        log('Connected to WebSocket Server!')
        sendMessage(messageCreator(CLIENT_ACTIONS.LOGIN))
      }

    const channel = yield call(createEventChannel, ws)
    while (true) {
      const { data } = yield take(channel)
      const payload = jsonParser(data)
      log(payload)
    }
  }

export default function* watchers() {
    // Initialize WebSocket Connection
    yield fork(createWSMessageReceiver)
    // yield fork(test)
}