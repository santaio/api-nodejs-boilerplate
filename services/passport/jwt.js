module.exports = (app) => {

  const passport = require('passport')
  const JwtStrategy = require('passport-jwt').Strategy
  const ExtractJwt = require('passport-jwt').ExtractJwt
  const Users = require('../../resources/users/model')

  const jwtOptions = {
    secretOrKey    : app.config.auth.secret_key,
    // jwtFromRequest: ExtractJwt.fromAuthHeader()
    jwtFromRequest : ExtractJwt.fromExtractors([
      ExtractJwt.fromUrlQueryParameter('access_token'),
      ExtractJwt.fromAuthHeaderWithScheme('JWT')
    ])
  }

  const JWTStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
    // console.log('PAYLOAD: ', payload);
    Users.findById(payload.sub)
      .then((user) => {
        if (!user) return done(null, false)
        return done(null, user)
      })
      .catch(error => done(error, null))
  })

  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    console.log(user)
    done(null, user)
  })

  passport.use(JWTStrategy)

  return passport.authenticate('jwt', { session: false })
}
