export const log = console.log.bind(console)

export const jsonParser = (data) => typeof data === 'string' ? JSON.parse(data) : data

export const stringifyJSON = (message) => typeof message === 'string' ? message : JSON.stringify(message)

export const messageCreator = (action, data) => ({ action: action, data: data })