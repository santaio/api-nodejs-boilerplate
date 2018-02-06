// /////////////////////////////////////////////////////
// Set API pagination query
// /////////////////////////////////////////////////////
const CONFIG = require('../config')

module.exports = () => (req, res, next) => {

  const LD = CONFIG.api.limit.default
  const LM = CONFIG.api.limit.max
  const { limit, page } = req.query

  req.limit = parseInt(limit, 10) <= LM ? parseInt(limit, 10) : LD
  req.page = page ? (parseInt(page, 10) <= 0 ? 1 : parseInt(page, 10)) : 1

  next()
  
}
