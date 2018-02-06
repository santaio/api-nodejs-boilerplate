const jwt = require('jwt-simple')
const crypto = require('crypto')

module.exports = (app) => {
  const Users = app.resources.users.model
  const Notify = app.helpers.notifications
  const mailgun = Notify.mailgun
  // const mailchimp = Notify.mailchimp;

  const SECRET_KEY = app.config.auth.secret_key
  const PROJECT_ID = app.config.auth.project_id
  const ISSUER = app.config.server.host
  const CUSTOMER = app.constants.ROLE_CUSTOMER
  const ENV = app.config.server.env

  const expiresIn = (days) => {
    const date = new Date()
    return date.setDate(date.getDate() + days)
  }

  // TODO: Review !!!
  const generateToken = (user) => {
    const expires = expiresIn(7) // 7 days
    const payload = {
      exp : expires,
      aud : PROJECT_ID,
      iss : ISSUER,
      sub : user.id
    }
    const token = jwt.encode(payload, SECRET_KEY)
    return { token, expires, user }
  }

  const AuthCtrl = {

    /*
     * POST: Create user with username and password.
     */

    signup: (req, res, next) => {
      // Check for registration errors
      const username = req.body.username
      const password = req.body.password
      const role = req.body.role

      // Return error if username not provided
      if (!username) {
        const error = new Error()
        error.custom = 'auth/username-not-provided'
        return next(error)
      }
      // Return error if password is less than 4 chars.
      if (username.length <= 4) {
        const error = new Error()
        error.custom = 'auth/weak-username'
        return next(error)
      }
      // Return error if password not provided
      if (!password) {
        const error = new Error()
        error.custom = 'auth/password-not-provided'
        return next(error)
      }
      // Return error if password is less than 4 chars.
      if (password.length <= 4) {
        const error = new Error()
        error.custom = 'auth/weak-password'
        return next(error)
      }
      // Return error if user role is unauthorized.
      if (role !== CUSTOMER) {
        const error = new Error()
        error.custom = 'auth/unauthorized-role'
        return next(error)
      }
      // Check if Username already exists.
      Users.findOne({ username }, (findErr, existingUser) => {
        // If something goes wrong, do not continue.
        if (findErr) return next(findErr)
        // Check if username exists.
        if (existingUser) {
          const error = new Error()
          error.custom = 'auth/user-already-in-use'
          return next(error)
        }
        // Now we can create the user user.
        const User = new Auth({ username, password })
        User.save((err, user) => {
          if (err) return next(err)
          // Subscribe member to Mailchimp list.
          // mailchimp.subscribeToNewsletter(user.email);
          // Respond with User Data
          const token = generateToken({
            id       : user.id,
            username : user.username,
            fullname : user.fullname || '',
            email    : user.email || '',
            provider : '',
            role     : user.role,
            avatar   : user.avatar
          })
          return res.status(201).json({
            success    : true,
            request_at : req.timestamp,
            message    : 'User has been created!',
            auth       : token
          })
        })
      })
    },

    /*
     * POST: Authenticate user with username and password.
     */

    signin: (req, res, next) => {
      if (req.body.username && req.body.password) {
        const username = req.body.username
        const password = req.body.password
        Users.findOne({ username }, (err, user) => {
          if (err) {
            const error = new Error()
            error.custom = 'auth/server-down'
            return next(error)
          }
          if (!user) {
            const error = new Error()
            error.custom = 'auth/user-not-found'
            return next(error)
          }
          user.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
              const error = new Error()
              error.custom = 'auth/invalid-credentials'
              return next(error)
            }

            const token = generateToken({
              id       : user.id,
              username : user.username || '',
              fullname : user.fullname || '',
              email    : user.email || '',
              provider : '',
              role     : user.role,
              avatar   : user.avatar
            })

            return res.json({
              success    : true,
              request_at : req.timestamp,
              message    : 'User has been authenticated!',
              auth       : token
            })
          })
        })
      }
    },

    /*
     * POST: Authenticate user with Provider.
     */

    provider: (req, res, next) => {
    },

    /*
     * GET: Facebook Authentication.
     */

    FBAuth: (req, res) => {
      const user = req.user
      const jwt = generateToken({
        id       : user._id,
        username : user.username || '',
        fullname : user.fullname || '',
        email    : user.email || '',
        role     : user.role,
        avatar   : user.avatar || ''
      })
      const redirectTo = req.cookies.redirect_to || ''
      res.clearCookie('redirect_to')
      res.cookie('access_token', JSON.stringify(jwt), {
        httpOnly : false,
        secure   : ENV == 'production',
        domain   : ENV == 'local' ? undefined : '.comercioregional.net',
        maxAge   : 24 * 60 * 60 * 1000
      })
      res.redirect(redirectTo)
    },

    /*
     * GET: Signs out the current user.
     */

    signout: (req, res) => {
      req.logout()
      // req.session.destroy();
      return res.json({
        success    : true,
        request_at : req.timestamp,
        message    : 'Bye!'
      })
    },

    /*
     * POST: Request a token by email to reset the password.
     */

    forgot: (req, res, next) => {
      if (req.body.email) {
        const email = req.body.email
        Users.findOne({ email }, (err, existingUser) => {
          // If user is not found, return error
          if (err || existingUser == null) {
            const error = new Error()
            error.custom = 'auth/user-not-found'
            return next(error)
          }
          // If user is found, generate and save resetToken
          // Generate a token with Crypto
          crypto.randomBytes(48, (err, buffer) => {
            const resetToken = buffer.toString('hex')
            if (err) return next(err)
            existingUser.resetPasswordToken = resetToken
            existingUser.resetPasswordExpires = Date.now() + 3600000 // 1 hour
            existingUser.save((err) => {
              // If error in saving token, return it
              if (err) return next(err)
              const message = {
                subject : 'Reset Password',
                text    : `$ {
                              'You are receiving this because you (or someone else) have requested the reset of the password for your user.\n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://'
                          }
                          $ {
                              req.headers.host
                          }
                          /reset-password/$ {
                              resetToken
                          }\n\n` + `If you did not request this,
                          please ignore this email and your password will remain unchanged.\n`
              }
              // Otherwise, send user email via Mailgun
              mailgun.sendEmail(existingUser.email, message)
              return res.status(200).json({
                success    : true,
                request_at : req.timestamp,
                message    : 'Please check your email for the link to reset your password.'
              })
            })
          })
        })
      } else {
        const error = new Error()
        error.custom = 'auth/email-not-provided'
        return next(error)
      }
    },

    /*
     * POST: Reset password with token received by email.
     */

    reset: (req, res, next) => {
      Users.findOne({
        resetPasswordToken   : req.params.token,
        resetPasswordExpires : {
          $gt: Date.now()
        }
      }, (err, resetUser) => {
        // If query returned no results, token expired or was invalid. Return error.
        if (!resetUser) {
          const error = new Error()
          error.custom = 'auth/token-expired'
          return next(error)
        }
        // Otherwise, save new password and clear resetToken from database
        resetUser.password = req.body.password
        resetUser.resetPasswordToken = undefined
        resetUser.resetPasswordExpires = undefined
        resetUser.save((err) => {
          if (err) {
            return next(err)
          }
          // If password change saved successfully, alert user via email
          const message = {
            subject : 'Password Changed',
            text    : 'You are receiving this email because you changed your password. \n\n' + 'If you did not request this change, please contact us immediately.'
          }
          // Otherwise, send user email confirmation of password change via Mailgun
          mailgun.sendEmail(resetUser.email, message)
          return res.status(200).json({
            success    : true,
            request_at : req.timestamp,
            message    : 'Password changed successfully. Please login with your new password.'
          })
        })
      })
    }

  }

  return AuthCtrl
}
