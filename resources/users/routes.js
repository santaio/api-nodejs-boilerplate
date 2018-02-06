module.exports = (app) => {
  const express = require('express')
  const requireAuth = app.services.passport.jwt
  const userRoutes = express.Router()
  const UserCtrl = app.resources.users.controller

  userRoutes.get('/', requireAuth, /* requireRole(ADMIN), */ UserCtrl.list) // Admin Only
  userRoutes.get('/:userId', requireAuth, UserCtrl.find)
  userRoutes.put('/:userId', requireAuth, UserCtrl.update)
  userRoutes.delete('/:userId', requireAuth, UserCtrl.destroy)

  return userRoutes
}
