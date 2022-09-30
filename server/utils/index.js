module.exports = {
    log: console.log.bind(console),
    jsonParser: (message) => typeof message === 'string' ? JSON.parse(message) : message,
    jsonStringify: (message) => typeof message === 'string' ? message : JSON.stringify(message)
}