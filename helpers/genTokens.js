const crypto = require('crypto')

module.exports = () => s =>
crypto.randomBytes(Math.ceil((s * 3) / 4))
.toString('base64')
.slice(0, s)
.replace(/\+/g, '0')
.replace(/\//g, '0')
