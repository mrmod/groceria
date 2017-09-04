// @interface LUIS Response Handler
// @(response) => ObjectWithProperties
// @(err) => String | Error | ObjectWithPropertiesf
const {predict} = require('./luis')

const AddGroceryItem = 'Add grocery item'
const GetGroceryList = 'Get grocery list'
const RemoveGroceryItem = 'Remove grocery item'

const FoodItemEntity = 'foodItem'
const FoodStoreEntity = 'foodStore'
const {ADD_GROCERY, GROCERY_LIST, INVALID_UTTERANCE} = require('./intents')
const receive = (text) => predict(text, successRouter, failureRouter)
.catch(failureRouter)

const failureRouter = (err) => {
  console.log('ERROR: Unable to get prediction', err)
  return `I ran into some problems, can you say that again?`
}

const successRouter = (response) => {
  console.log('TRACE: NLU', response)
  console.log('INFO: Processing intent', response.topScoringIntent.intent)
  switch (response.topScoringIntent.intent) {
  case AddGroceryItem:
    return Object.assign({},
      {action: ADD_GROCERY},
      addGrocery(response.entities))
  case GetGroceryList:
    return Object.assign({},
      {action: GROCERY_LIST},
      giveGroceryList(response.entities)
    )
  case RemoveGroceryItem:
    return Object.assign({},
      {action: REMOVE_GROCERY},
      removeGrocery(response.entities)
    )
  }
  return Object.assign({},
    {action: INVALID_UTTERANCE},
    {text: invalidUtterance()}
  )
}
const selectFoodItem = (entity) => entity && entity.type === FoodItemEntity
const selectFoodStore = (entity) => entity && entity.type === FoodStoreEntity
const findFoodStore = (entities) => {
  let foodStore = entities.find(selectFoodStore)
  if (foodStore) {
    return foodStore.entity
  }
  return null
}

const giveGroceryList = (entities) => Object.assign({}, {
  text: `I have no lists yet`,
  groceryList: {
    foodStore: findFoodStore(entities),
  },
})


const groceryAction = (entities, action) => {
  if (entities.length === 0) {
    console.log('Unable to pick out a food item from', entities)
    return {
      text: invalidUtterance(),
      action: INVALID_UTTERANCE,
    }
  }
  let foodItem = entities.find(selectFoodItem)
  let foodStore = entities.find(selectFoodStore)
  if (foodStore && foodItem) {
    return {
      text: action(foodItem, foodStore),
      grocery: {
        foodItem: foodItem.entity,
        foodStore: foodStore.entity,
      },
    }
  }
  if (foodItem) {
    return {
      text: action(foodItem),
      grocery: {
        foodItem: foodItem.entity,
      },
    }
  }

  console.log('Unable to pick out a food item from', entities)
  return {
    text: invalidUtterance(),
    action: INVALID_UTTERANCE,
  }
}

const removedItem = (item, store) => {
  if (store) {
    // eslint-disable-next-line max-len
    return `K, I'll take ${item.entity} off of your ${store.entity} list`
  }

  return `Got it, I'll take ${item.entity} off the list`
}

const addedItem = (item, store) => {
    if (store) {
      // eslint-disable-next-line max-len
      return `Ok, I'll remind you to get ${item.entity} when you're at ${store.entity}`
    }

    return `Got it, I'll remind you to get ${item.entity}`
}
// Helpers
const addGrocery = (entities) => groceryAction(entities, addedItem)
const removeGrocery = (entities) => groceryAction(entities, removedItem)

const invalidUtterance = () => {
  return `I don't know that one.
You can say "Pick up beans", or "Pick up peanut butter from Whole Foods"`
}

module.exports = {receive}
// receive('But can you listen?').then((msg) => console.log(msg))
