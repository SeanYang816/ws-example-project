const log = console.log.bind(console)
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 1234 })

wss.on("connection", ws => {
  log('New client connected!')

  ws.on('message', data => {
    log(`Client has sent a message: ${data}`)
    // data.toString() to convert to human readable code

    ws.send(data.toString().toLocaleUpperCase())
  })

  ws.on('close', () => {
    log('Client has disconntected!')
  })
})

log('Server Started ...')