const ajc = require('array-join-conjunction')

const textGroceryList = (groceryList) => {
  let foodItems = groceryList.map((g) => g.foodItem)
  if (foodItems.length === 1) {
    return `Only ${foodItems[0]}`
  }
  if (foodItems.length < 4) {
    return ajc(foodItems, 'and')
  }
  return foodItems.join('\n')
}

module.exports = {textGroceryList}
