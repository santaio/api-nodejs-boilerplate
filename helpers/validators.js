
  const ObjectId = require('mongoose').Types.ObjectId

  module.exports = (app) => {

    const regexCollections = {
      email    : /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      ddd      : /^\d{2}$/,
      phone    : /^\d{8}(?:\d{1})?$/,
      objectId : /^[a-fA-F0-9]{24}$/
    }
    
    // MONGOOSE VALIDATORS
    const checkId = id => ObjectId.isValid(id) && regexCollections.objectId.test(id)
    const checkSchemaType = type => hasOwnProperty.call(app.models.schemas, type)
    const documentExists = (type, id) => new Promise((resolve, reject) => checkSchemaType(type).isValid && checkId(id).isValid ? (
       app.models[type].findById(id).count().then(result => resolve({ error: result ? null : 'cannot-find-by-id', isValid: !!result }))
      .catch(err => reject({ error: err, isValid: false }))
   ) : resolve({ error: checkSchemaType(type).error || checkId(id).error, isValid: false }))

    const isArray = v => Array.isArray(v)
    const gte = (p, n) => p >= n
    const phoneDDD = v => /^\d{2}$/.test(v)
    const phoneNumber = v => regexCollections.phone.test(v)
    const includes = (i, o) => o.includes(i)
    const email = v => regexCollections.email.test(v)

    return {
      regexCollections,
      checkId,
      checkSchemaType,
      phoneDDD,
      phoneNumber,
      documentExists,
      isArray,
      includes,
      gte,
      email
    }

  }
