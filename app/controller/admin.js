'use strict'

const Controller = require('egg').Controller

class AdminController extends Controller {
  /* POST
   * 管理员登录
   */
  async login() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.admin.login(data)

    ctx.body = res
    ctx.status = 200
  }

  /* POST
   * 创建管理员
   */
  async create() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.admin.createAdmin(data)

    ctx.body = res
    ctx.status = 200
  }
}

module.exports = AdminController
