'use strict'

module.exports = (moduleName, purviews = []) => {
  return async function auth(ctx, next) {
    const { permissions } = ctx.state.user
    if (permissions) {
      const hasPermission = permissions.some(el => {
        console.log(moduleName)
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
