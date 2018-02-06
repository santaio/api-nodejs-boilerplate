module.exports = (app) => {
  process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    app.use((err, req, res, next) => {
      if (!err) return next()
      return res.status(500).json({
        success : false,
        message : err.message,
        error   : process.env.NODE_ENV === 'development' ? {} : err
      })
    })
  })

  process.on('warning', (warning) => {
    console.warn(warning.name)    // Print the warning name
    console.warn(warning.message) // Print the warning message
    console.warn(warning.stack)   // Print the stack trace
  })

  process.on('uncaughtException', (err) => {
    console.log(err.stack)
  })

  process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`)
  })
}
