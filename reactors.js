const {addGrocery, allGroceries} = require('./grocery')
const {
  ADD_GROCERY,
  REMOVE_GROCERY,
  GROCERY_LIST,
  INVALID_UTTERANCE} = require('./intents')
const {textGroceryList} = require('./render')

const groceryReactor = (payload, grocery, senderId) => {
  console.log(`[reactor] ${payload.action}`)
  console.log('Payload:', payload)
  switch (payload.action) {
  case ADD_GROCERY:
    return addGrocery(senderId, grocery.foodItem, grocery.foodStore)
    .then(() => Object.assign({},
      payload,
      {sender: senderId}
    ))
  case REMOVE_GROCERY:
    return removeGrocery(senderId, grocery.foodItem, grocery.foodStore)
    .then(() => Object.assign({},
      payload,
      {sender: senderId}
    ))
  case GROCERY_LIST:
    return allGroceries(senderId, payload.groceryList.foodStore)
    .then((groceryList) => Object.assign({},
      payload,
      {
        sender: senderId,
        text: textGroceryList(groceryList),
      }
    ))
    .then((compiled) => {
      console.log('TRACE: Payload', compiled)
      return compiled
    })
  case INVALID_UTTERANCE:
    return Object.assign({}, payload, {sender: senderId})
  }
  console.log('invalid payload', payload)
  return {
    text: `I'm unable to help with that.`,
    sender: senderId,
  }
}

module.exports = {groceryReactor}
