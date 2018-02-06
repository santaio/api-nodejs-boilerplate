const express = require('express')

module.exports = (app) => {

  const Main = express.Router()
  // API
  const Index = app.resources.index.routes
  const Auth = app.resources.authentication.routes
  const users = app.resources.users.routes
  const Storage = app.resources.storage.routes

  Main.use('/users', users)

  Main.use('/', Index)

  app.use('/v1', Main)
  app.use('/v1/auth', Auth)
  app.use('/v1/storage', Storage)
}
