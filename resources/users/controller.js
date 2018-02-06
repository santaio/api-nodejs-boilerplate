module.exports = (app) => {

  const Users = app.resources.users.model
  const Response = app.helpers.data

  const { ROLE_ADMIN } = app.constants

  const UserCtrl = {

    // counter: (req, res) => {
    //   Users.count().exec((e, count) => {
    //     console.log('count', count);
    //     return res.json({
    //       success: true,
    //       request_at: req.timestamp,
    //       type: 'users',
    //       href: req.location,
    //       data: count
    //     });
    //   });
    // },

    /*
     * GET: Finds all users
     */

    list: (req, res) => {
      Users
        .find(req.query)
        .select('_id username fullname avatar email mobile role')
        .exec((err, users) => {
          let user
          const usersResponse = Response.setUsersData(users, user)
          if (err) {
            return res.status(412).json({
              success    : false,
              request_at : req.timestamp,
              message    : err.errmsg
            })
          }
          return res.json({
            success    : true,
            request_at : req.timestamp,
            type       : 'users',
            href       : req.location,
            data       : usersResponse
          })
        })
    },

    /*
    * GET: Find user by id
    */

    find: (req, res, next) => {
      const { userId } = req.params
      Users
        .findById(userId)
        .select('_id username fullname avatar email mobile role')
        .exec((err, user) => {
          const userResponse = Response.setUserData(user)
          if (err) {
            const error = new Error()
            error.custom = 'auth/user-not-found'
            return next(error)
          }
          if (user) {
            return res.json({
              success    : true,
              request_at : req.timestamp,
              type       : 'users',
              href       : req.location,
              data       : userResponse
            })
          }

          return res.json({
            success    : false,
            request_at : req.timestamp,
            type       : 'users',
            href       : req.location,
            data       : null
          })
        })
    },

    /*
     * PUT: Update user by id.
     */

    update: (req, res, next) => {
      const { userId } = req.params
      const AuthUser = req.user
      const fields = [ 'location', 'city', 'fullname', 'username', 'region',
        'hometown', 'phones', 'email', 'gender', 'password' ]

      if (AuthUser.role !== ROLE_ADMIN && (userId !== AuthUser._id)) {
        return res.status(401).end()
      }

      Users.findById(userId).exec((err, foundUser) => {
        const result = {
          success    : !err,
          request_at : req.timestamp,
          href       : req.location
        }

        if (err) {
          result.error = err
          return res.status(412).json(result)
        }

        Object.keys(req.body).map((key, index) => {
          if (fields.indexOf(key) > -1) {
            if (req.body[key] != undefined || '') {
              foundUser[key] = req.body[key]
            }
          }
        })

        foundUser.save((err, updatedUser) => {
          if (err) {
            result.error = err
            return res.status(412).json(result)
          }
          return res.json(result)
        })
      })
    },

    /*
     * DELETE: cancel user by id
     */

    destroy: (req, res) => {
      const { userId } = req.params
      // Remove this User.
      Users.findByIdAndRemove(userId, (err) => {
        if (err) {
          const error = new Error()
          error.custom = 'auth/user-not-found'
          return next(error)
        }

        return res.status(204).end()
      })
    }

  }

  return UserCtrl
}
