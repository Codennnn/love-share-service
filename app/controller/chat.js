'use strict'

const Controller = require('egg').Controller

class ChatController extends Controller {
  /* GET
   * 获取联系人列表
   */
  async getContactList() {
    const { ctx, service } = this
    const res = await service.chat.getContactList(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取联系人信息
   */
  async getContactInfo() {
    const { ctx, service } = this

    try {
      ctx.validate({ user_id: 'string' }, ctx.request.query)
      const res = await service.chat.getContactInfo(ctx.request.query.user_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取聊天记录
   */
  async getChatData() {
    const { ctx, service } = this
    const res = await service.chat.getChatData(ctx.state.user.id)
    ctx.reply(res)
  }
}

module.exports = ChatController
