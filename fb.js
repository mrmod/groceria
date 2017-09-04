const FB = require('fb-messenger')
const config = require('./config')

const token = config.fbToken

const messenger = new FB(token)
const Regular = 'REGULAR'

const sendText = (toId, message) => new Promise((resolve, reject) => {
  console.log('Sending', message, 'to', toId)
  messenger.sendTextMessage(toId, message, Regular, (err, body) => {
    if (err) {
      reject(err)
      return
    }
    console.log('Sent message')
    resolve(body)
    return
  })
})

module.exports = {
  sendText,
}
