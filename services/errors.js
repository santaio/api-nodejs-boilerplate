// TYPES:

// CLIENT
// 400: Bad Request
// 401: Unauthorized
// 403: Forbidden
// 404: Not Found
// 412: Pre-condition failed

// SERVER
// 500: Internal Server Error

/*
// Creating errors
const error = require('helpers/errors');
// or call a helper (much better)
error.throwErr('Your error message', 404); // throws an error

// build an error
// ERROR_CONSTANT would be a general error
// if you don't pass a custom message, the default one for this constant is gonna be used
var err = error.newErr('ERROR_CONSTANT', 404)
var err = error.newErr('ERROR_CONSTANT', 404, 'Your custom message')
*/

module.exports = (app) => {
  const _const = app.constants
  const isProd = process.env.NODE_ENV === 'production'

  const validator = (err, req, res, next) => {
    switch (err.custom) {

      // /////////////////////////////////////////////
      // GENERAL ERRORS
      // /////////////////////////////////////////////

    case _const.ERR_RESOURCE_NOT_FOUND:
      {
        var message = err.message ? err.message : 'Recurso não encontrado'

        res.status(err.code || 404).json({
          success    : false,
          request_at : req.timestamp,
          message,
          stack      : isProd ? null : err.stack
        })
        break
      }

    case _const.ERR_INTERNAL_ERROR:
      {
        var message = err.message ? err.message : 'Houve um erro durante a requisição'

        res.status(err.code || 500).json({
          success    : false,
          request_at : req.timestamp,
          message
        })
        break
      }

    case _const.ERR_BAD_REQUEST:
      {
        res.status(err.code || 412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Conteúdo da requisição mal formatado',
          stack      : isProd ? null : err.stack
        })
        break
      }

      // /////////////////////////////////////////////
      // AUTH
      // /////////////////////////////////////////////

    case 'auth/no-access-token':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'No Access Token'
        })
        break
      }

    case 'auth/expired-action-code':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'The token for password reset has expired'
        })
        break
      }

    case 'auth/invalid-action-code':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'The token for password reset is invalid'
        })
        break
      }

    case 'auth/user-not-found':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'User Not Found'
        })
        break
      }

    case 'auth/user-token-expired':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Your token has expired'
        })
        break
      }

    case 'auth/invalid-credentials':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Invalid credentials'
        })
        break
      }

    case 'auth/wrong-password':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Invalid password for the given username'
        })
        break
      }

    case 'auth/email-already-in-use':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'That email is already in use'
        })
        break
      }

    case 'auth/user-already-in-use':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'That username is already in use'
        })
        break
      }

    case 'auth/unauthorized-role':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Unauthorized Role'
        })
        break
      }

    case 'auth/username-not-provided':
      {
        res.status(401).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'You must provide a username'
        })
        break
      }

    case 'auth/password-not-provided':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'You must provide a password'
        })
        break
      }

    case 'auth/weak-username':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Username must be at least 4 characters long'
        })
        break
      }

    case 'auth/weak-password':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Password must be at least 4 characters long'
        })
        break
      }

    case 'auth/unauthorized-domain':
      {
        res.status(403).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'This domain is not authorized'
        })
        break
      }

      // /////////////////////////////////////////////
      // API
      // /////////////////////////////////////////////

    case 'api/network-request-failed':
      {
        res.status(500).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Can not stabilish a connection with the server'
        })
        break
      }

      // /////////////////////////////////////////////
      // RESOURCES
      // /////////////////////////////////////////////

    case 'resource/category-already-exists':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'The category already exists. Please try again'
        })
        break
      }

    case 'resource/city-already-exists':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'The city already exists. Please try again'
        })
        break
      }

      // /////////////////////////////////////////////
      // PRODUCTS
      // /////////////////////////////////////////////

    case 'product/invalid-id':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Invalid product Identifier'
        })
        break
      }

    case 'product/cannot-find-by-id':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Cannot find any product with the provided Identifier'
        })
        break
      }

      // /////////////////////////////////////////////
      // /ME PRODUCTS
      // /////////////////////////////////////////////

    case 'product/favorite/already-favorited':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Product already set as favorite'
        })
        break
      }

    case 'product/favorite/not-found':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Product is not set as favorite'
        })
        break
      }


    case 'product/rating/already-rated':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'User already rate it, use PUT method for edit'
        })
        break
      }

    case 'product/rating/not-found':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Product is not rated by user'
        })
        break
      }

    case 'product/rating/invalid-rate-number':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Invalid rate'
        })
        break
      }

    case 'product/rating/missing-rate-number':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Missing rate number'
        })
        break
      }


      // /////////////////////////////////////////////
      // /ME STORE
      // /////////////////////////////////////////////

    case 'store/follow/already-following':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'User already following store'
        })
        break
      }

    case 'store/follow/not-found':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Store not set as follow'
        })
        break
      }

    case 'store/invalid-id':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Invalid store Identifier'
        })
        break
      }

    case 'store/cannot-find-by-id':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Cannot find any product with the provided Identifier'
        })
        break
      }


      // /////////////////////////////////////////////
      // GENERIC INCONSISTENCIES
      // /////////////////////////////////////////////

    case 'invalid-id':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Invalid Identifier'
        })
        break
      }

    case 'not-found-schema':
      {
        res.status(412).json({
          success    : false,
          request_at : req.timestamp,
          message    : 'Cannot Find Requested Schema'
        })
        break
      }

      // /////////////////////////////////////////////
      // DEFAULT
      // /////////////////////////////////////////////

    default:
      {
        let stack
        let message = 'Oops! Houve um erro no processamento da requisição'
        if (!isProd) {
          stack = err.stack
          message = err.message
          console.error(err)
        }

        res.status(500).json({
          message,
          success    : false,
          request_at : req.timestamp,
          stack
        })
        break
      }
    }
  }

  app.use(validator)
}
