import {useEffect, useMemo, useState} from 'react'
import HomePage from './pages/HomePage/HomePage'
import { jsonParser, log, messageCreator } from './utils'
import { useDispatch } from 'react-redux'
import {connectWebSocket, initialize} from 'reducers'
import { v4 as uuid } from 'uuid';
import {CLIENT_ACTIONS, SERVER_ACTIONS} from 'constants'
import {getWs} from 'sagas/rootSaga'

function App() {
  const ws = getWs()
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const [chatList, setChatList] = useState([])
  const sendMessage = message => {
    const command = {
      ...message,
      id: uuid(),
      timestamp: Date.now(),
    }
    return ws.send(JSON.stringify(command))
  }
  
  const handleChatUpdate = (message) => setChatList(message.data)
  const eventMaps = {
    // [SERVER_ACTIONS.LOGIN]: (e) => console.log(e)
    [SERVER_ACTIONS.SEND_MESSAGE]: handleChatUpdate,
  }
  useEffect(() => {
    dispatch(connectWebSocket())
    // dispatch(initialize('initialize'))

    ws.onopen = (e) => {
      log('Connected to WebSocket Server!')
      sendMessage(messageCreator(CLIENT_ACTIONS.LOGIN))
    }

    ws.addEventListener('message', event => {
      const message = jsonParser(event.data)
      eventMaps[message.action]?.(message)
    })
  }, [dispatch, ws])

  const handleTextSend = () => {
    sendMessage(messageCreator(CLIENT_ACTIONS.SEND_MESSAGE, text))
    setText('')
  }
  const handleTextChange = (e) => setText(e.target.value)

  return (
    <>
    <input type="text" onChange={handleTextChange} value={text} />
      <button onClick={handleTextSend}>Send</button>
    <div id="chat">
      {chatList.map(chat => <div key={chat.id}>{`${chat.clientId}: ${chat.data}`}</div>)}
    </div>
    </>
    // <HomePage />
  );
}

export default App;
