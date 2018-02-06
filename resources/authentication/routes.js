module.exports = (app) => {
  const express = require('express')
  const AuthCtrl = app.resources.authentication.controller
  const ENV = app.config.server.env

    // Auth
  const authRoutes = express.Router()
  const requireFBoAuth = app.services.passport.facebook

    // Setting JWT Auth
  authRoutes.post('/signup', AuthCtrl.signup)
  authRoutes.post('/signin', AuthCtrl.signin)
  authRoutes.get('/signout', AuthCtrl.signout)

    // Setting Password Manager
  authRoutes.post('/forgot-password', AuthCtrl.forgot)
  authRoutes.post('/reset-password/:token', AuthCtrl.reset)

    // Setting Facebook OAuth
  authRoutes.get('/facebook', (req, res, next) => {
    res.cookie('redirect_to', (req.headers.referer || req.location), {
      httpOnly : true,
      secure   : ENV == 'production',
      domain   : ENV == 'local' ? undefined : '.comercioregional.net',
      maxAge   : 24 * 60 * 60 * 1000
    })
    return next()
  }, requireFBoAuth)
  authRoutes.get('/facebook/callback', requireFBoAuth, AuthCtrl.FBAuth)

  return authRoutes
}
