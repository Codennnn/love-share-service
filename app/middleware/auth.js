'use strict'

const isArray = val => {
  return Object.prototype.toString.call(val) === '[object Array]'
}

module.exports = (moduleName, purviews = []) => {
  return async function auth(ctx, next) {
    const { permissions } = ctx.state.user
    if (moduleName && isArray(permissions)) {
      const hasPermission = permissions.some(el => {
        if (el.module === moduleName) {
          return purviews.every(it => el.purview.indexOf(it) > -1)
        }
        return false
      })
      if (hasPermission) {
        await next()
      } else {
        ctx.status = 401
      }
    } else {
      ctx.status = 401
    }
  }
}
