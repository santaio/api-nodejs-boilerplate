module.exports = (app) => {
  const ENV = process.env.NODE_ENV || 'development'
  const API_TITLE = app.config.api.title
  const API_VERSION = app.config.api.version
  const AUTH_TITLE = app.config.auth.title
  const AUTH_VERSION = app.config.auth.version
  const STORAGE_TITLE = app.config.storage.title
  const STORAGE_VERSION = app.config.storage.version

  const IndexCtrl = {

    // AUTH
    auth: (req, res) => {
      res.json({
        title   : AUTH_TITLE,
        version : AUTH_VERSION
      })
    },

    // API
    api: (req, res) => {
      res.json({
        title       : API_TITLE,
        version     : API_VERSION,
        environment : ENV
      })
    },

    // STORAGE
    storage: (req, res) => {
      res.json({
        title       : STORAGE_TITLE,
        version     : STORAGE_VERSION,
        environment : ENV
      })
    }

  }

  return IndexCtrl
}
