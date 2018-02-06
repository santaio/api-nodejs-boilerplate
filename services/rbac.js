 const { underline } = require('../helpers/console')()

 class RBAC {
    
   constructor(opts) {
     this.init(opts)
   }

   init(roles) {

     if (typeof roles !== 'object') {
       throw new TypeError('Expected an object as input')
     }
        
     this.roles = roles
     const map = {}
     Object.keys(roles).forEach((role) => {
       map[role] = {
         can: {}
       }
       if (roles[role].inherits) {
         map[role].inherits = roles[role].inherits
       }
        
       roles[role].can.forEach((operation) => {
         if (typeof operation === 'string') {
           map[role].can[operation] = 1
         } else if (typeof operation.name === 'string'
                        && typeof operation.when === 'function') {
           map[role].can[operation.name] = operation.when
         }
       })
        
     })
        
     this.roles = map
   }

   can(role, operation, params) {

     return new Promise((resolve, reject) => {

       const resolvePromise = (role, result) => {
         this.logPermission(role, operation, result)
         return resolve(result)
       }

       const rejectPromise = (role, result) => {
         this.logPermission(role, operation, result)
         return reject(result)
       }

       if (typeof role !== 'string') {
         throw new TypeError('Expected first parameter to be string : role')
       }

       if (typeof operation !== 'string') {
         throw new TypeError('Expected second parameter to be string : operation')
       }

       const $role = this.roles[role]

       if (!$role) {
         throw new Error('Undefined role')
       }

       if (!$role.can[operation]) {
            
         if (!$role.inherits) {
           return rejectPromise(role, false)
         }

         return Promise.all($role.inherits.map(parent => this.can(parent, operation, params)))
                    .then(result => resolvePromise(role, result.indexOf(true) > -1))
                    .catch(() => rejectPromise(role, false))
       }

       if ($role.can[operation] === 1) {
         return resolvePromise(role, true)
       }

       if (typeof $role.can[operation] === 'function') {
         return $role.can[operation](params, (err, result) => {
           if (err) {
             return reject(err)
           }
           if (!result) {
             if ($role.inherits) {
               return Promise.all($role.inherits.map(parent => this.can(parent, operation, params)))
                    .then(result => resolvePromise(role, result.indexOf(true) > -1))
                    .catch(() => rejectPromise(role, false))
             }
             return resolvePromise(role, false)
           }
           return resolvePromise(role, true)
         })
       }
       return rejectPromise(role, false)
     })
   }

   logPermission(role, operation, result) {
     if (process.env.NODE_ENV !== 'production') {
       const fResult = result ? `\x1b[1;32m${result}\x1b[1;34m` : `\x1b[1;31m${result}\x1b[1;34m`
       const fRole = `\x1b[1;32m${role}\x1b[1;34m`
       const fOperation = `\x1b[1;32m${operation}\x1b[1;34m`
       try {
         console.log('\x1b[33m%s\x1b[0m: ', underline())  // yellow
         console.log('\x1b[1;34m%s\x1b[0m: ', `RBAC - ROLE: [${fRole}] OPERATION: [${fOperation}] PERMISSION: [${fResult}]`)
         console.log('\x1b[33m%s\x1b[0m: ', underline())
       } catch (e) {}
     }
   }

}

 module.exports = () => opts => new RBAC(opts)
