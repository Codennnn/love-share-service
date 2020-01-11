'use strict'

module.exports = op => {
  return async function auth1(ctx, next) {
    console.log(op)
    const { roles } = ctx.state.user
    // 如果是普通管理员，则放行
    if (roles) {
      if (roles.includes('admin') || roles.includes('super_admin')) {
        await next()
      }
    } else {
      ctx.status = 401
    }
  }
}
