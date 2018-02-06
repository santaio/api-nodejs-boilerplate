// /////////////////////////////////////////////////////
// Set API Location
// /////////////////////////////////////////////////////

module.exports = app => (req, res, next) => {

  try {
    
    const originalLocation = `${req.protocol}://${req.hostname}${req.originalUrl}`
    const location = `${req.protocol}://${req.hostname}${req.baseUrl}`
    const { underline } = app.helpers.console
    const NODE_ENV = process.env.NODE_ENV
    req.NODE_ENV = NODE_ENV
    req.EnvIsProd = NODE_ENV === 'production'
    req.EnvIsDev = NODE_ENV === 'development'
    req.EnvIsLocal = NODE_ENV === 'local'
    req.EnvIsStaging = NODE_ENV === 'staging'
    req.location = location
    
    console.log('\x1b[33m%s\x1b[0m: ', underline())  // yellow
    console.log('\x1b[1;33m%s\x1b[0m: ', `${req.method} - ${originalLocation}`)
    console.log('\x1b[33m%s\x1b[0m: ', underline())

    if (req.cookies && req.cookies.length) {
      console.log('\x1b[1;32m%s\x1b[0m: ', `COOKIES ${JSON.stringify(req.cookies) || undefined}`)
      console.log('\x1b[33m%s\x1b[0m: ', underline())
    }

  } catch (e) { console.log(e) }

  next()

}
