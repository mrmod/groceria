const got = require('got')

const witUrl = 'https://api.wit.ai/message?v=20170904'
const token = 'Bearer 4AZR2FKGFT7K3RW6U3TPIRTQUAMUPYJM'

const utter = (utterance) => got(
  `${witUrl}&q=${utterance}`,
  {
    headers: {
      'Authorization': token,
    }
  }
)
.then(decodeResponse)
.then(addGrocery)
.catch((err) => {
  console.log('ERROR:', utterance, '->', err)
  throw err
})


const addGrocery = (witResponse) => {
  console.log('TRACE: ', witResponse)
  console.log('ENTITIES:', witResponse.entities)
}
const decodeResponse = (response) => JSON.parse(response.body)

utter('Pick up spinach')
