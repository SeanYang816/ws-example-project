const  { jsonParser, jsonStringify, log } = require('./utils')

const WebSocket = require('ws')
const uuid = require('uuid')
const {SERVER_ACTIONS, CLIENT_ACTIONS} = require('./constants')
const wss = new WebSocket.Server({ port: 1234 })
const CLIENT_LIST = []
const CLIENT_CHAT_LIST = []

const handleLogin = () => sendAll(jsonStringify({ action: SERVER_ACTIONS.LOGIN }))


const handleMessageChatUpdate = (message) => {
  CLIENT_CHAT_LIST.push({ ...message })
  sendAll(jsonStringify({ action: SERVER_ACTIONS.SEND_MESSAGE, data: CLIENT_CHAT_LIST}))
}

const eventMaps = {
  [CLIENT_ACTIONS.LOGIN]: handleLogin,
  [CLIENT_ACTIONS.SEND_MESSAGE]: handleMessageChatUpdate,
}

wss.on("connection", ws => {
  const clientId = uuid.v4()
  CLIENT_LIST.push({ clientId, ws })
  log(`Client ${clientId} has connected!`)
  sendAll(jsonStringify({ action: SERVER_ACTIONS.SEND_MESSAGE, data: CLIENT_CHAT_LIST}))

  ws.on('message', (msg, isBinary) => {
    const data = isBinary ? msg : msg.toString();
    const message = jsonParser(data)

    // key function
    eventMaps[message.action] && eventMaps[message.action]?.({ clientId, ...message }, ws)
    })

  ws.on('close', () => {
    const index = CLIENT_LIST.findIndex(client => client.clientId)
    const CLIENT_LEAVE = CLIENT_LIST[index].clientId
    CLIENT_LIST.splice(index, 1)
    log(`Client ${CLIENT_LEAVE} has disconntected!`)
    sendAll(`Client ${CLIENT_LEAVE} has disconntected!`)
  })
})

function sendAll (message) {
  for (let i = 0; i < CLIENT_LIST.length; i++) {
      CLIENT_LIST[i].ws.send(message);
  }
}

log('Server Started ...')