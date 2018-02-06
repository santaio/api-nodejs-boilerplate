const mongoose = require('mongoose')

const { ROLE_CUSTOMER, ROLE_STORE_OWNER,
        ROLE_STORE_MANAGER, ROLE_ADMIN } = require('../../constants')
const { regexCollections } = require('../../helpers/validators.js')()

const Schema = {
  username : { type: String, trim: true, lowercase: true },
  password : { type: String },
  phones   : [{
    type   : { type: String, enum: [ 'phone', 'cell' ] },
    ddd    : { type: String, match: [ regexCollections.ddd, 'DDD must contain 2 digits' ] },
    number : { type: String, match: [ regexCollections.phone, 'must contain between 8 and 9 digits' ] },
    _id    : false
  }],
  email    : { type: String, trim: true, lowercase: true, match: regexCollections.email }, // , unique: true
  fullname : { type: String },
  avatar   : { type: Array, default: 'http://placehold.it/120x120' },
  role     : {
    type    : String,
    enum    : [ ROLE_CUSTOMER, ROLE_STORE_MANAGER, ROLE_STORE_OWNER, ROLE_ADMIN ],
    default : ROLE_CUSTOMER
  },
  provider: {
    facebook: {
      id      : { type: String },
      token   : { type: String },
      profile : { type: mongoose.Schema.Types.Mixed }
    }
  },
  tokens: [{
    token     : { type: String },
    expires   : { type: Date },
    createdAt : { type: Date },
    type      : { type: String, enum: [ 'create:manager:sms', 'reset:password:sms', 'create:manager:whatsapp', 'create:manager:email', 'reset:password:email' ] },
    store     : { type: mongoose.Schema.Types.ObjectId, ref: 'stores' },
    _id       : false
  }],
  gender    : { type: String, default: '' },
  interests : [{
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'categories'
  }],
  favorites: [{
    product : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    time    : { type: Date, default: Date.now },
    _id     : false
  }],
  following: [{
    store : { type: mongoose.Schema.Types.ObjectId, ref: 'stores' },
    time  : { type: Date, default: Date.now },
    _id   : false
  }],
  ratings: [{
    product : { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    rate    : { type: Number },
    time    : { type: Date, default: Date.now },
    _id     : false
  }],
  location: {
    street       : { type: String, default: '' },
    number       : { type: Number, default: '' },
    neighborhood : { type: String, default: '' },
    zip_code     : { type: Number, default: '' },
    ibge_code    : { type: String, default: '' }
  },
  region: {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'regions'
  },
  city: {
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'cities'
  },
  stores: [{
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'stores'
  }],
  reports: [{
    views  : { type: Number, default: 0 },
    clicks : { type: Number, default: 0 }
  }]
}

module.exports = new mongoose.Schema(Schema)
