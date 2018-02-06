module.exports = (app) => {
  const express = require('express')
  const IndexRoutes = express.Router()
  const IndexCtrl = app.resources.index.controller

    // Set Indexes Views
  IndexRoutes.get('/', IndexCtrl.api)

  return IndexRoutes
}
