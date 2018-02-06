module.exports = (app) => {
  const checkUserAction = (type, req, user) => {
    const targets = {
      favorites: () => {
        for (const item of user.favorites) {
          if (req._id.equals(item.product)) { return true }
        }
        return false
      },
      following: () => {
        if (req.store) {
          for (const item of user.following) {
            if (req.store[0]._id.equals(item.store)) { return true }
          }
        }
        for (const item of user.following) {
          if (req._id.equals(item.store)) { return true }
        }
        return false
      },
      scored: () => {
        for (const item of user.ratings) {
          if (req._id.equals(item.product)) { return item.rate }
        }
        return undefined
      }
    }
    return targets[type]()
  }

  return checkUserAction
}
