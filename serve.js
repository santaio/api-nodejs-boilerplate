// import http from 'http';

module.exports = (app) => {
  const config = require('./config')
  const HOST = app.config.server.host
  const PORT = app.config.server.port
  const ENV = app.config.server.env

  process.title = `dm9ddb-${config.server.env}-node`
  const format = {
    centerText: (txt) => {
      let spc = ''
      for (let i = 0; i < Math.trunc((process.stdout.columns - txt.length) / 2); i++) { spc += ' ' }
      return `${spc}${txt}`
    }
  }
  const title = format.centerText(`${config.api.title} - ${config.api.version}`)
  const subtitle = format.centerText(`Environment: ${config.server.env}`)
  console.log('\u001b[1m\x1b[31m\n%s\x1b[0m', title)
  console.log('\u001b[1m\x1b[34m%s\n\x1b[0m', subtitle)
  
  // http.createServer(app)
  app.listen(PORT, () => {
    console.log(`[SERVER] => Up and Running at http://${HOST}:${PORT}, in ${ENV} mode.`)
  })
}
