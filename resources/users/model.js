const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const userSchema = require('./schema')

// Hooks

// Validators
// import Email from './validators/email';

module.exports = () => {

  userSchema.index({ 'phones.ddd': 1, 'phones.number': 1 }, { unique: true })
  // INDEXES
  // =========================
  // userSchema.path('username').index({ unique: true });

  // HOOKS
  // =========================

  // Encrypt Password
  userSchema.pre('save', function (next) {
    const needPassUpdate = this.password && (this.isModified('password') || this.isNew)
    const SALT_FACTOR = 5
    const user = this
    if (needPassUpdate) {
      return bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, null, (err, hash) => {
          if (err) return next(err)
          user.password = hash
          return next()
        })
      })
    }
    return next()
  })

  // VALIDATORS
  // =========================
  // userSchema.path('email').validate(Email.validator, Email.message);

  // METHODS
  // =========================

  // Check Password
  userSchema.methods.comparePassword = function (password, next) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return next(err)
      next(null, isMatch)
    })
  }

  userSchema.set('timestamps', true)

  let users
  try {
    users = mongoose.model('users')
  } catch (e) {
    users = mongoose.model('users', userSchema)
  }

  return users
}
