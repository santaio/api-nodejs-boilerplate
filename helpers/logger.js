const fs = require('fs')
const winston = require('winston')
const rotate = require('winston-daily-rotate-file')

module.exports = (app) => {
  const ENV = app.config.server.env
  const FOLDER = app.config.server.logs

  // Create the log directory if it does not exist.
  if (!fs.existsSync(FOLDER)) {
    fs.mkdirSync(FOLDER)
  }

  // Create a timestamp for logs.
  const dateTime = () => (new Date()).toLocaleTimeString()

  // Create new instance for Logger.
  const logger = new (winston.Logger)({
    transports: [
      // Colorize the output to the console.
      new (winston.transports.Console)({
        level       : 'debug',
        timestamp   : dateTime,
        colorize    : true,
        prettyPrint : true
      }),
      // Create Access Log File History.
      new (rotate)({
        name             : 'access-file',
        level            : ENV === 'development' ? 'verbose' : 'info',
        filename         : `./${FOLDER}/-access.log`,
        json             : true,
        datePattern      : 'yyyy-MM-dd',
        prepend          : true,
        timestamp        : dateTime,
        handleExceptions : true,
        maxsize          : 10485760, // 10MB
        maxFiles         : 50
      }),
      // Create Error Log File History.
      new (rotate)({
        name             : 'error-file',
        level            : 'error',
        filename         : `./${FOLDER}/-error.log`,
        json             : true,
        datePattern      : 'yyyy-MM-dd',
        prepend          : true,
        timestamp        : dateTime,
        handleExceptions : true,
        maxsize          : 10485760, // 10MB
        maxFiles         : 50
      })
    ]
  })

  return logger
}
