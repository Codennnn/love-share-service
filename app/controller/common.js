'use strict'

const Controller = require('egg').Controller

class CommonController extends Controller {
  /* GET
   * 测试 API 服务
   */
  async serviceTest() {
    this.ctx.reply('您正在使用乐享校园 API 服务！ ୧(๑•̀⌄•́๑)૭✧')
  }

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
    ctx.validate({ phone: 'string' })
    const res = await service.common.getVerificationCode(ctx.state.user.id, ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = CommonController
