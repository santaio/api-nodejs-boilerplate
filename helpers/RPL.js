module.exports = (app) => {

  const { ROLE_ADMIN, ROLE_STORE_OWNER, ROLE_STORE_MANAGER, ROLE_CUSTOMER } = app.constants

  // Role Permissions Level
  return (role) => {
    let level
    if (role === ROLE_ADMIN) {
      level = 4
    } else if (role === ROLE_STORE_OWNER) {
      level = 3
    } else if (role === ROLE_STORE_MANAGER) {
      level = 2
    } else if (role === ROLE_CUSTOMER) {
      level = 1
    } else {
      level = 1
    }
    return level
  }
  
}
