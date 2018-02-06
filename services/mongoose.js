const mongoose = require('mongoose')

module.exports = (app) => {
  const ENV = process.env.NODE_ENV || 'development'
  const DATABASE = app.config.database[ENV]
  const DEBUG = app.config.database.debug

  mongoose.Promise = global.Promise

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`)
    process.exit(-1)
  })

  mongoose.connection.on('connected', () => {
    console.log(`[DATABASE] => Database successfully connected to ${DATABASE}`)
  })

  mongoose.connect(DATABASE, { useMongoClient: true })
  mongoose.set('debug', DEBUG)

  return mongoose
}
