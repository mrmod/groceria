const datastore = require('./datastore')

const toDatastore = (obj, nonIndexed) => {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1,
    });
  });
  return results;
}

const clean = (obj) => {
  for (let propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj
}

// No transactions
const saveNotx = (key, data, excludeFromIndexes) => {
  if (data[datastore.KEY]) {
    delete data[datastore.KEY]
  }

  let entity = {
    key: key,
    data: toDatastore(clean(data), excludeFromIndexes),
  }

  return datastore.save(entity).then(
    (saved) => {
      data[datastore.KEY] = key
      return data
    }
  )
}

const updateNotx = (key, data) => saveNotx(key, data)

const purgeTx = (keyOrKeys) => {
  const transaction = datastore.transaction();
  return transaction.run()
    .then(() => {
      if (keyOrKeys === undefined || keyOrKeys === null) {
        return Promise.reject(new Error('No key or keys given to purge'))
      }
      if (Array.isArray(keyOrKeys)) {
        return Promise.all(keyOrKeys.map((k) => datastore.delete(k)))
      }
      return datastore.delete(keyOrKeys)
    })
    .then(() => transaction.commit())
    .catch((err) => {
      console.log('ERROR: Failed to purge', err)
      return transaction.rollback()
    })
}

const findNotx = (key) => {
  return datastore.get(key).then( (results) => results[0] )
}

const runQuery = (q) => datastore.runQuery(q).then((r) => r[0])

const findFirst = (q) => datastore.runQuery(q).then((r) => r[0][0])

const allocateIdsNoTx = (kind, qty) => datastore.allocateIds(
  datastore.key([kind]),
  qty
).then((data) => data[0]) // apiResponse is field [1]

const purgeAll = (entities) => purgeTx(
  entities.filter((e) => e !== undefined && e !== null)
  .map((e) => e[datastore.KEY])
)

module.exports = {
  allocateIds: allocateIdsNoTx,
  // Save with key
  save: saveNotx,
  // Purge key or [keys]
  purge: purgeTx,
  // Purge [entities]
  purgeAll,
  update: updateNotx,
  // Find first entity
  findFirst: findFirst,
  // Find all entities
  find: findNotx,
  // Synonym for find
  runQuery: runQuery,

}
