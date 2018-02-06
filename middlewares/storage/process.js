module.exports = (app) => {
  // Storage
  // ----------------------
  const storage = require('./index')
  const fieldsConfig = app.config.storage.fields
  const processStorage = [
    storage.request().fields(fieldsConfig),
    storage.response,
    storage.resize,
    storage.cleanup,
    storage.upload,
    storage.prepare
  ]

  return processStorage
}
