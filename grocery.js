const {GroceryKind} = require('./kinds')
const {save, runQuery, purgeAll} = require('./backend.js')
const ds = require('./datastore')

const moment = require('moment')

const addGrocery = (addedBy, foodItem, foodStore) => save(
  ds.key([GroceryKind]),
  {
    addedBy: addedBy,
    foodItem: foodItem,
    foodStore: foodStore,
    addedAt: moment.utc().toDate(),
  }
)

// eslint-disable-next-line max-len
const isFoodStore = (grocery, foodStore) => grocery && grocery.foodStore && foodStore && grocery.foodStore.toLowerCase() === foodStore.toLowerCase()
// eslint-disable-next-line max-len
const isFoodItem = (grocery, foodItem) => grocery && grocery.foodItem && foodItem && grocery.foodItem.toLowerCase() === foodItem.toLowerCase()

const removeGrocery = (addedBy, foodItem, foodStore) => allGroceries
.then((groceryList) => purgeAll(
  groceryList.filter((grocery) => {
    if (foodStore) {
      return isFoodItem(grocery, foodItem) && isFoodStore(grocery, foodStore)
    }
    return isFoodItem(grocery, foodItem)
  })
))

const allGroceries = (addedBy, foodStore) => runQuery(
  ds.createQuery(GroceryKind).filter('addedBy', '=', addedBy)
)
.then((groceries) => {
  if (foodStore) {
    return groceries.filter((g) => g.foodStore === foodStore)
  }
  return groceries
})

module.exports = {
  addGrocery,
  removeGrocery,
  allGroceries,
}
