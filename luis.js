const LUIS = require('luis-sdk')
const config = require('./config')
const appId = config.appId
const appKey = config.appKey

// luis/v2.0/apps/a71daa73-e5d5-4253-b64c-5189d014f9dc
// subscription-key=65fe6eaee64846589332c8b48ae49485
// &staging=true&verbose=true&timezoneOffset=0&q=
const luis = LUIS({
  appId: appId,
  appKey: appKey,
  domain: 'westus.api.cognitive.microsoft.com',
  verbose: true,
  staging: true,
})

/*
response:
 {
  query: '',
  topScoringIntent: { intent: 'intentName', score: 0.9999},
  intents: [
    { intent: {intent: 'intentName', score: 0.00 }
  ],
  entities: [
    { entity: 'dimsum', type: 'cat', startIndex: 1, endIndex: 6, score: 0.9}
  ]
  }
*/
const predict = (text, onSuccess, onFailure) => new Promise((res, rej) => {
  luis.predict(text,
  {
    onSuccess: (response) => res(onSuccess(response)),
    onFailure: (err) => rej(onFailure(err)),
  })
})

const onFailureLog = (err) => console.log('ERROR: Prediction error', err)
const onSuccessLog = (response) => console.log(response)
module.exports = {predict, onFailureLog}
