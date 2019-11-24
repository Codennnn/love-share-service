'use strict'

module.exports = () => {
  return async function auth2(ctx, next) {
    const { roles } = ctx.state.user
    // 如果是超级管理员，则放行
    if (roles && roles.includes('super_admin')) {
      await next()
    } else {
      ctx.status = 401
    }
  }
}
