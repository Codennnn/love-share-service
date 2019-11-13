'use strict'

module.exports = options => {
  return async function permission(ctx, next) {
    const { url } = ctx.request
    const result = await ctx.model.Admin.find({ _id: ctx.state.admin.id }, 'roles')
    if (result[0]) {
      const roles = result[0].roles
      // 如果是超级管理员，直接 next，如果是普通管理员，则先判断是否有权限访问 url，superUrl 只有超级管理员可访问
      if (roles.includes('super_admin')) {
        await next()
      } else if (roles.includes('admin') && !options.superUrl.includes(url)) {
        await next()
      } else {
        ctx.body = { code: 4003, msg: '无权访问！' }
        ctx.status = 200
      }
    } else {
      ctx.body = { code: 4003, msg: '无权访问！' }
      ctx.status = 200
    }
  }
}
