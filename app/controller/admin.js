'use strict'

const sendToWormhole = require('stream-wormhole')
const Controller = require('egg').Controller

class AdminController extends Controller {
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
        real_name: 'string',
        permissions: { type: 'array', itemType: 'object' },
        avatar_url: 'string',
        gender: [0, 1],
        email: 'email?',
      })
      const res = await service.admin.createAdmin(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* POST
   * 管理员登录
   */
  async signIn() {
    const { ctx, service } = this
    try {
      ctx.validate({
        account: 'string',
        password: 'string',
      })
      const res = await service.admin.signIn(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取管理员列表
   */
  async getAdminList() {
    const { ctx, service } = this
    const res = await service.admin.getAdminList()
    ctx.reply(res)
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

  /* GET
   * 获取管理员信息
   */
  async getAdminInfo() {
    const { ctx, service } = this
    const res = await service.admin.getAdminInfo(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取管理员信息
   */
  async getAdminDetail() {
    const { ctx, service } = this
    try {
      ctx.validate({ admin_id: 'string' }, ctx.request.query)
      const res = await service.admin.getAdminDetail(ctx.request.query.admin_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取管理员信息
   */
  async replaceAvatar() {
    const { ctx, service } = this
    const stream = await ctx.getFileStream()
    try {
      const res = await service.user.replaceAvatar(ctx.state.user.id, stream)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
      await sendToWormhole(stream)
    }
  }
}

module.exports = AdminController
