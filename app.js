const consign = require('./helpers/consign/consign.js')
const express = require('express')

const app = express()

consign()
  .include('config.js')
  .then('constants.js')
  .then('helpers')
  .then('middlewares')
  .then('services')
  .then('resources', /model/i)
  .then('resources', /authorization/i)
  .then('resources', /validators/i)
  .then('resources', /controller/i)
  .then('resources', /routes/i)
  .then('middlewares.js')
  .then('process.js')
  .then('router.js')
  .then('serve.js')
  .into(app)

module.exports = app
