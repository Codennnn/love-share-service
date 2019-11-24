'use strict'

const Controller = require('egg').Controller

class CommonController extends Controller {
  /* POST
   * 检测手机号是否已被注册
   */
  async checkPhoneNumber() {
    const { ctx, service } = this
    const res = await service.common.checkPhoneNumber(ctx.request.body.phone)

    ctx.body = res
    ctx.status = 200
  }

  /* POST
   * 获取用户注册验证码
   */
  async getVerificationCode() {
    const { ctx, service } = this

    try {
      ctx.validate({ phone: 'string' })
      const { phone } = ctx.request.body
      const res = await service.common.getVerificationCode(phone)
      ctx.body = res
      ctx.status = 200
    } catch (err) {
      ctx.body = err
      ctx.status = 400
    }
  }
}

module.exports = CommonController
