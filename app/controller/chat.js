'use strict'

const Controller = require('egg').Controller

class ChatController extends Controller {
  /* POST
   * 添加新的联系人
   */
  async addContact() {
    const { ctx, service } = this

    try {
      ctx.validate({ user_id: 'string?', contact_id: 'string' })
      const id = ctx.request.body.user_id || ctx.state.user.id
      const contactId = ctx.request.body.contact_id
      const res = await service.chat.addContact(id, contactId)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除联系人
   */
  async deleteContact() {
    const { ctx, service } = this

    try {
      ctx.validate({ user_id: 'string?', contact_id: 'string' })
      const id = ctx.request.body.user_id || ctx.state.user.id
      const contactId = ctx.request.body.contact_id
      const res = await service.chat.deleteContact(id, contactId)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取联系人列表
   */
  async getContactList() {
    const { ctx, service } = this
    const id = ctx.query.user_id || ctx.state.user.id
    const res = await service.chat.getContactList(id)
    ctx.reply(res)
  }

  /* GET
   * 获取联系人信息
   */
  async getContactInfo() {
    const { ctx, service } = this
    try {
      ctx.validate({ user_id: 'string' }, ctx.query)
      const res = await service.chat.getContactInfo(ctx.query.user_id)
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
    const id = ctx.query.user_id || ctx.state.user.id
    const res = await service.chat.getChatData(id)
    ctx.reply(res)
  }
}

module.exports = ChatController
