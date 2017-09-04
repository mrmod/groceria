const {receive} = require('./luisGrocery')
const {sendText} = require('./fb')
const {groceryReactor} = require('./reactors')

const verifyToken = 'myTokenLiesOverTheOcean'

const receiveText = (req, res) => {
  if (req.query['hub.verify_token'] === verifyToken) {
    res.status(200).send(req.query['hub.challenge'])
    return
  }
  // Handle messages
  if (req.body.entry) {
    let messages = []

    let entries = req.body.entry.filter((e) => e.messaging)
    entries.forEach((e) => e.messaging.forEach((msg) => messages.push(msg)))
    // console.log('Entries', entries)
    // console.log('Messages:', messages)
    Promise.all(messages.map(handleFb))
    .then(() => {
      console.log('Processed all messages')
      res.status(200).end()
    })
    .catch((err) => {
      console.log('ERROR: Unable to process messages', err)
      res.status(500)
    })
    return
  } else {
    res.status(400).end()
    return
  }

  res.status(403).end()
}

const hookTest = (req, res) => receive(req.body.message.text)
.then((payload) => groceryReactor(
  payload,
  payload.grocery,
  'fakeId'
))
.then((payload) => res.status(200).send({saying: payload.text}))

const handleFb = (msgHook) => {
  return receive(msgHook.message.text)
  // {state: '', text: '', modelAction: ''}
  .then((payload) => groceryReactor(
    payload,
    payload.grocery,
    msgHook.sender.id
  ))
  .then((payload) => sendText(payload.sender, payload.text))
}

module.exports = {
  receiveText,
  hookTest,
}
// utter('Pick up granola')
// .then((wr) => isAddGrocery(wr) ? addGrocery(wr) : pickUp(wr))
//
// utter('What should I get from CostCo?')
// .then((wr) => isAddGrocery(wr) ? addGrocery(wr) : pickUp(wr))
