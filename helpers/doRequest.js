const request = require('request')

module.exports = (app) => {
  const doRequest = url => new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(JSON.parse(body))
      } else {
        reject(error)
      }
    })
  })

  return doRequest
}
