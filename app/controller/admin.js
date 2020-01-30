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

  /* PUT
   * 更新管理员
   */
  async updateAdmin() {
    const { ctx, service } = this
    try {
      ctx.validate({ admin_id: 'string' })
      const res = await service.admin.updateAdmin(ctx.request.body)
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
        position: 'object',
        device: 'string',
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
   * 获取其他管理员的详细
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

  /* POST
   * 上传头像
   */
  async uploadAvatar() {
    const { ctx, service } = this
    const stream = await ctx.getFileStream()
    try {
      const res = await service.admin.uploadAvatar(stream)
      ctx.reply(res)
    } catch (err) {
      await sendToWormhole(stream)
      ctx.reply(err, 400)
    }
  }

  /* POST
   * 替换管理员的头像
   */
  async replaceAvatar() {
    const { ctx, service } = this
    try {
      ctx.validate({
        admin_id: 'string',
        avatar_url: 'string',
      })
      const res = await service.admin.replaceAvatar(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取登录日志信息
   */
  async getSignLog() {
    const { ctx, service } = this
    const res = await service.admin.getSignLog(ctx.state.user.id, ctx.request.query)
    ctx.reply(res)
  }

  /* PUT
   * 绑定用户
   */
  async bindUser() {
    const { ctx, service } = this
    try {
      ctx.validate({ phone: 'string' })
      const res = await service.admin.bindUser(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 取消绑定用户
   */
  async unbindUser() {
    const { ctx, service } = this
    const res = await service.admin.unbindUser(ctx.state.user.id)
    ctx.reply(res)
  }

  /* PUT
   * 修改密码
   */
  async updatePassword() {
    const { ctx, service } = this
    try {
      ctx.validate({ old_pwd: 'string', new_pwd: 'string' })
      const res = await service.admin.updatePassword(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 修改锁屏密码
   */
  async updateLockPassword() {
    const { ctx, service } = this
    try {
      ctx.validate({ password: 'string' })
      const res = await service.admin.updateLockPassword(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = AdminController
