const  { jsonParser, jsonStringify, log } = require('./utils')
const { SERVER_ACTIONS, CLIENT_ACTIONS } = require('./constants')
const uuid = require('uuid')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator')


const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 1234 })
const clientList = []
const CLIENT_CHAT_LIST = []

const handleChatUpdate = (message) => {
  const { actionName: action, actionData: data, messageId: reply_to_messageId, clientId, visitorName } = message
  const command = {
    action, data, reply_to_messageId, clientId, visitorName
  }
  CLIENT_CHAT_LIST.push(command)
  sendAll(jsonStringify({ action: SERVER_ACTIONS.SEND_MESSAGE, data: CLIENT_CHAT_LIST}))
}

const config = {
  dictionaries: [adjectives, colors, animals]
}

const eventMaps = {
  [CLIENT_ACTIONS.LOGIN]: () => sendAll(jsonStringify({ action: SERVER_ACTIONS.LOGIN })),
  [CLIENT_ACTIONS.SEND_MESSAGE]: handleChatUpdate,
}

wss.on("connection", ws => {
  const clientId = uuid.v4()
  const visitorName = uniqueNamesGenerator(config)

  clientList.push({ visitorName, clientId, ws })
  log(`${visitorName} has connected!`)
  sendAll(jsonStringify({ action: SERVER_ACTIONS.SEND_MESSAGE, data: CLIENT_CHAT_LIST}))

  ws.on('message', (msg, isBinary) => {
    const data = isBinary ? msg : msg.toString();
    const { action: actionName, data: actionData, messageId } = jsonParser(data)

    // key function
    eventMaps[actionName] && eventMaps[actionName]?.({ visitorName ,clientId, messageId, actionName, actionData }, ws)
    })

  ws.on('close', () => {
    const index = clientList.findIndex(client => client.clientId)
    const CLIENT_LEAVE = clientList[index].clientId
    clientList.splice(index, 1)
    log(`${visitorName} has disconntected!`)
    sendAll(`${CLIENT_LEAVE} has disconntected!`)
  })
})

function sendAll (message) {
  for (let i = 0; i < clientList.length; i++) {
      clientList[i].ws.send(message);
  }
}

log('Server Started ...')