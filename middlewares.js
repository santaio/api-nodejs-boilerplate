// /////////////////////////////////////////
// INITIALIZE MIDDLEWARES                //
// /////////////////////////////////////////

const enforce = require('express-sslify')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
const override = require('method-override')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan')
const helmet = require('helmet')

module.exports = (app) => {
  const ENV = app.config.server.env
  const CORS = app.config.api.cors
  const LOG = app.helpers.logger
  const customValidators = app.helpers.validators

  // App Logger
  // --------------------

  LOG.stream = {
    stream: {
      write: (message) => {
        LOG.info(message)
      }
    }
  }

  app.use(morgan('dev', LOG.stream)) // combined

  // App Config
  // --------------------

  // SETTINGS
  app.set('env', ENV)

  // HEADER
  app.set('x-powered-by', false)

  // DEBUG
  app.set('json spaces', 4)

  // HTTPS/SSL
  if (ENV === 'production') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }))
  }

  // MEHTOD OVERRIDE
  app.use(override())

  // HELMET (for Security)
  app.use(helmet())

  // CORS
  app.use(cors(CORS))

  // COMPRESSION (GZIP support)
  app.use(compression())

  // BODY PARSE
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(bodyParser.urlencoded({ extended: true }))

  // VALIDATOR
  app.use(validator({ customValidators }))

  // SESSION
  app.use(cookieParser())
  app.use(app.services.passport.initialize)

  // CUSTOM MIDDLEWARES
  
  app.use([ '/v1/*' ], [
    app.middlewares.timestamp,
    app.middlewares.location,
    app.middlewares.pagination
  ])

  app.all('/*', (req, res, next) => req.method === 'OPTIONS' ? res.status(200).end() : next())
}
