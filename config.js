const imageOptions = {
  keepAspectRatio: (metadata, max) => {
    metadata.width > metadata.height ?
    (metadata.width = max, metadata.height = null) :
    (metadata.width = null, metadata.height = max)
    return metadata
  }
}

const config = {

  // API =======================================================
  api: {
    title   : 'Express API',
    version : '1.0.0',
    cors    : {
      origin  : '*',
      methods : [
        'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'
      ],
      allowHeaders: [
        'Origin',
        'X-Requested-With',
        'X-Key',
        'Content-Type',
        'Accept',
        'Authorization',
        'Access-Control-Allow-Credentials'
      ],
      credentials: true
    },
    limit: {
      max     : 200,
      default : 20
    }
  },

  // SERVER =====================================================
  env    : process.env.NODE_ENV || 'development',
  server : {
    env  : process.env.NODE_ENV || 'development',
    host : process.env.HOST || 'localhost',
    ip   : process.env.IP || '0.0.0.0',
    port : process.env.PORT || 8080,
    logs : process.env.LOGS || 'logs'
  },

  // STORAGE ====================================================

  storage: {
    title           : 'API boilerplate - Storage',
    version         : '1.0.0',
    upload_folder   : './uploads/',
    accessKeyId     : '',
    secretAccessKey : '',
    region          : 'us-east-1',
    development     : {
      bucket: 'api-dev'
    },
    local: {
      bucket: 'api-dev'
    },
    staging: {
      bucket: 'api-dev'
    },
    production: {
      bucket: 'comercio-regional'
    },
    fields: [
      {
        name     : 'logo_store',
        maxCount : 1,
        sizes    : [
        { type: 'large', width: 500, height: 500 },
        { type: 'medium', width: 300, height: 300 },
        { type: 'thumb', width: 100, height: 100 }
        ]
      }, {
        name     : 'gallery_store',
        maxCount : 10,
        sizes    : [
          { type: 'large', width: 800, height: null },
          { type: 'medium', options: { func: imageOptions.keepAspectRatio, max: 500 } },
          { type: 'thumb', options: { func: imageOptions.keepAspectRatio, max: 250 } }
        ]
      }, {
        name     : 'gallery_product',
        maxCount : 10,
        sizes    : [
          { type: 'large', width: 800, height: null },
          { type: 'medium', options: { func: imageOptions.keepAspectRatio, max: 500 } },
          { type: 'thumb', options: { func: imageOptions.keepAspectRatio, max: 250 } }
        ]
      }, {
        name     : 'image_category',
        maxCount : 1,
        sizes    : [
           { type: 'large', width: 800, height: null },
           { type: 'medium', width: 350, height: null },
           { type: 'thumb', width: 100, height: 100 }
        ]
      }
    ],
    default_sizes: [
       { type: 'large', width: 800, height: null },
       { type: 'medium', width: 500, height: null },
       { type: 'thumb', width: 250, height: null }
    ]
  },

  // DATABASE ===================================================

  database: {
    development : process.env.MONGODB_URI || 'mongodb://localhost/api-dev',
    local       : process.env.MONGODB_URI || 'mongodb://localhost/api-dev',
    production  : process.env.MONGODB_URI || 'mongodb://localhost/api-dev',
    staging     : process.env.MONGODB_URI || 'mongodb://localhost/api-dev',
    live        : process.env.MONGODB_URI || 'mongodb://localhost/api-dev',
    debug       : true,
    session     : {
      url           : process.env.MONGODB_URI || '',
      autoReconnect : true
    }
  },

  // AUTH =======================================================

  auth: {
    title      : 'API boilerplate - Authentication',
    version    : '1.0.0',
    // client_id: uuidV1(),     // Use on Server Flow Auth, pass on url param
    // client_secret: uuidV4(), // Use on Server Flow Auth, pass on url param
    secret_key : 'fb307960-e829-11e6-a1e3-1557743505ae',
    session    : false,
    token      : {
      expires: {
        expiresIn: 10080
      }
    },
    facebook: {
      development: {
        client_id     : process.env.CLIENT_ID || 'KEY',
        client_secret : process.env.CLIENT_SECRET || 'KEY',
        callback_url  : '/v1/auth/facebook/callback/',
        scope         : [ 'id', 'email', 'displayName', 'name', 'gender', 'picture.type(large)' ]
      },
      production: {
        client_id     : process.env.CLIENT_ID || 'KEY',
        client_secret : process.env.CLIENT_SECRET || 'KEY',
        callback_url  : '/v1/auth/facebook/callback/',
        scope         : [ 'id', 'email', 'displayName', 'name', 'gender', 'picture.type(large)' ]
      }
    }
  },

  // MAIL =======================================================

  mail: {
    mailgun: {
      login    : process.env.MAILGUN_LOGIN || 'USERNAME',
      password : process.env.MAILGUN_PASSWORD || 'KEY'
    },
    sendgrid: {
      user     : process.env.SENDGRID_USER || 'USERNAME',
      password : process.env.SENDGRID_PASSWORD || 'KEY'
    },
    mailchimp: {
      client_id     : process.env.MAILCHIMP_CLIENT_ID || 'USERNAME',
      client_secret : process.env.MAILCHIMP_CLIENT_SECRET || 'KEY',
      lists         : {
        customer     : process.env.MAILCHIMP_CUSTOMER_LIST || '',
        shop_manager : process.env.MAILCHIMP_SHOP_MANAGER_LIST || ''
      }
    }
  }
  
}

module.exports = Object.freeze(config)
