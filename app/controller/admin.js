'use strict'

const Controller = require('egg').Controller

class AdminController extends Controller {
  /* POST
   * 管理员登录
   */
  async login() {
    const { ctx, service } = this
    const res = await service.admin.login(ctx.request.body)
    ctx.reply(res)
  }

  /* POST
   * 创建管理员
   */
  async createAdmin() {
    const { ctx, service } = this

    try {
      ctx.validate({
        account: 'string',
        password: 'string',
        nickname: 'string',
      })
      const res = await service.admin.createAdmin(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* POST
   * 重置管理员密码
   */
  async resetPassword() {
    const { ctx, service } = this
    const res = await service.admin.resetPassword(
      ctx.state.user.id,
      ctx.request.body
    )
    ctx.reply(res)
  }
}

module.exports = AdminController
