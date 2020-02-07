'use strict'

const Controller = require('egg').Controller

class CommonController extends Controller {
  /* POST
   * 检测手机号是否已被注册
   */
  async checkPhoneNumber() {
    const { ctx, service } = this
    const res = await service.common.checkPhoneNumber(ctx.request.body.phone)
    ctx.reply(res)
  }

  /* POST
   * 检测用户昵称是否已被使用
   */
  async checkNickname() {
    const { ctx, service } = this
    const res = await service.common.checkNickname(ctx.request.body.nickname)
    ctx.reply(res)
  }

  /* POST
   * 获取用户注册验证码
   */
  async getVerificationCode() {
    const { ctx, service } = this
    try {
      ctx.validate({ phone: 'string' })
      const res = await service.common.getVerificationCode(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = CommonController
