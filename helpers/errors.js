const _consts = require('../constants')

/**
 * Creates a new custom error and returns it
 *
 * @param {string} [type=_consts.ERR_INTERNAL_ERROR] the error type
 * @param {int} [code=null] the error code (http status)
 * @param {any} [message=null] a custom message
 * @returns the newly created error
 */
function newErr(type = _consts.ERR_INTERNAL_ERROR, code = null, message = null) {
  const err = new Error(message)
  err.custom = type
  err.code = code
  return err
}

/**
 * Creates a new custom error and throws it
 *
 * @param {string} [type=_consts.ERR_INTERNAL_ERROR] the error type
 * @param {int} [code=null] the error code (http status)
 * @param {any} [message=null] a custom message
 */
function throwErr(type = _consts.ERR_INTERNAL_ERROR, code = null, message = null) {
  const err = newErr(type, code, message)
  throw err
}

module.exports = {
  newErr,
  throwErr
}
