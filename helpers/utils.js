const ObjectId = require('mongoose').Types.ObjectId

module.exports = () => {

 // prune object
  const prune = (obj) => {
    for (const k in obj) {
      if (!obj[k] || typeof obj[k] !== 'object') { continue }
      prune(obj[k])
      if (Object.keys(obj[k]).length === 0) { delete obj[k] }
    }
    return obj
  }

    // deep Object Property Empty Remover
  const doper = (obj) => {
    Object.keys(obj).forEach(k => (obj[k] && typeof obj[k] === 'object') && doper(obj[k]) || (obj[k] === undefined) && delete obj[k])
    return prune(obj)
  }

  // get property nested objects
  const getProp = (obj, key) => key.split('.').reduce((o, x) => (typeof o === 'undefined' || o === null) ? o : o[x], obj)

  // check if object has nested property, return Boolean
  const hasProp = (obj, key) => key.split('.').every((x) => {
    if (typeof obj !== 'object' || obj === null || !(x in obj)) { return false }
    obj = obj[x]
    return true
  })

  const has = (obj, key) => obj ? hasOwnProperty.call(obj, key) : false

  // ARRAYS UTILS

  // fisher yates (aka Knuth) shuffle
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  const shuffle = (a = []) => {
    const r = []
    while (a.length !== 0) {
      const x = Math.floor(a.length * Math.random())
      r.push(a[x])
      a.splice(x, 1)
    }
    return r
  }

  const containsObjectId = (a, id) => {
    if (!a.length || !id) return false
    return a.map(i => String(i)).includes(String(id))
  }

  // STRINGS UTILS

  const toObjectId = id => (ObjectId(id))

  const calcAverage = (ratings = [], initialAverage = false) => {
    if (initialAverage) { ratings.push(1, 5) }
    const total = ratings.length
    const sum = ratings.reduce((prev, actual) => actual += prev)
    const avg = sum / total
    return avg
  }

  return {
    prune,
    doper,
    getProp,
    hasProp,
    has,
    shuffle,
    containsObjectId,
    toObjectId,
    calcAverage
  }

}
