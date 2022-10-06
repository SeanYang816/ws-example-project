import {useEffect, useState} from 'react'
import { jsonParser, messageCreator } from 'utils'
import { useDispatch } from 'react-redux'
import {connectWebSocket} from 'reducers'
import { v4 as uuid } from 'uuid';
import {CLIENT_ACTIONS, SERVER_ACTIONS} from 'constants'
import {getWs} from 'sagas/rootSaga'

function Chat() {
    const ws = getWs()
    const dispatch = useDispatch()
    const [text, setText] = useState('')
    const [chatList, setChatList] = useState([])
    const sendMessage = message => {
      const command = {
        ...message,
        messageId: uuid(),
        timestamp: Date.now(),
      }
      return ws.send(JSON.stringify(command))
    }
    
    const handleChatUpdate = (message) => setChatList(message.data)
    const eventMaps = {
      [SERVER_ACTIONS.SEND_MESSAGE]: handleChatUpdate,
    }
    useEffect(() => {
      dispatch(connectWebSocket())
  
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
  
    console.info(chatList)
    return (
      <>
      <input type="text" onChange={handleTextChange} value={text} />
        <button onClick={handleTextSend}>Send</button>
      <div id="chat">
        {chatList.map(chat => <div key={chat.reply_to_messageId}>{`${chat.visitorName}: ${chat.data}`}</div>)}
      </div>
      </>
    );
  }
  
  export default Chat;