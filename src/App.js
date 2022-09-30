import {useEffect, useMemo, useState} from 'react'
import HomePage from './pages/HomePage/HomePage'
import { jsonParser, log, messageCreator } from './utils'
import { useDispatch, useSelector } from 'react-redux'
import {initialize} from 'reducers'
import { v4 as uuid } from 'uuid';
import {CLIENT_ACTIONS, SERVER_ACTIONS} from 'constants'

function App() {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const [chatList, setChatList] = useState([])
  const ws = useMemo(() => new WebSocket('ws://localhost:1234')
  , [])
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
    [SERVER_ACTIONS.SEND_MESSAGE]: handleChatUpdate
  }
  useEffect(() => {
    dispatch(initialize('initialize'))
    ws.addEventListener('open', () => {
      log('Connected to WebSocket Server!')
      sendMessage({ action: CLIENT_ACTIONS.LOGIN })
    })

    ws.addEventListener('message', event => {
      const message = jsonParser(event.data)
      log(message)
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
