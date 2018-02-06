const passport = require('passport')
const OAuthStrategy = require('passport-facebook').Strategy
const Users = require('../../resources/users/model')

module.exports = (app) => {

  const ENV = app.config.server.env
  const FBConfig = app.config.auth.facebook[ENV] || app.config.auth.facebook.development

  const facebookOptions = {
    clientID      : FBConfig.client_id,
    clientSecret  : FBConfig.client_secret,
    callbackURL   : FBConfig.callback_url,
    profileFields : FBConfig.scope
  }

  const FacebookStrategy = new OAuthStrategy(facebookOptions, (accessToken, refreshToken, profile, done) => {
    const conditions = {
      $or: [
        {
          'provider.facebook.id': profile.id
        }, {
          email: profile.emails
            ? {
              $in: profile.emails.map(email => email.value)
            } : undefined
        }
      ]
    }

    Users.findOne(conditions, (err, foundUser) => {
      if (err) throw (err)
      if (!err && foundUser) {

        profile.photos && profile.photos.length ? (
          foundUser.avatar = profile.photos[0].value
        ) : null

        foundUser.provider.facebook = {
          id    : profile.id,
          token : accessToken
        }

        if (!foundUser.gender) {
          foundUser.gender = profile.gender
        }

        if (!foundUser.phones.length && profile.phones) {
          foundUser.phones = profile.phones
        }

        if (!foundUser.fullname) {
          foundUser.fullname = profile.displayName
        }

        return foundUser.save((err, savedUser) => {
          if (err) throw err
          return done(null, savedUser)
        })
      }

      const newUser = new Users({
        provider: {
          facebook: {
            id    : profile.id,
            token : accessToken
          }
        },
        fullname : profile.displayName,
        avatar   : profile.photos.length ? profile.photos[0].value : undefined,
        gender   : profile.gender,
        email    : profile.emails ? profile.emails[0].value : undefined,
        phones   : profile.phones
      })

      newUser.save((err, savedUser) => {
        if (err) throw err
        done(null, savedUser)
      })
    })
  })

  passport.use(FacebookStrategy)

  return passport.authenticate('facebook', { session: false, scope: [ 'email' ] })
}
