const ROLE_ADMIN = 'admin'
const ROLE_USER = 'user'

const ACTIVE = 'active'
const INACTIVE = 'inactive'
const AWAITING = 'awaiting'

const SMS = 'sms'
const WHATSAPP = 'whatsapp'
const EMAIL = 'email'

module.exports = {
  ROLE_ADMIN,
  ROLE_USER,
  ACTIVE,
  INACTIVE,
  AWAITING,
  SMS,
  WHATSAPP,
  EMAIL,
  // ERROR CONSTANTS
  ERR_INTERNAL_ERROR     : 'INTERNAL_ERROR', // unknown error = 500
  ERR_RESOURCE_NOT_FOUND : 'RESOURCE_NOT_FOUND', // not found = 404,
  ERR_BAD_REQUEST        : 'BAD_REQUEST'
}
