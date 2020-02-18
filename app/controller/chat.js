'use strict'

const Controller = require('egg').Controller

class ChatController extends Controller {
  constructor(ctx) {
    super(ctx)
    if (ctx.state && ctx.state.user) {
      this._id = ctx.state.user.id
    }
  }

  /* POST
   * 添加新的联系人
   */
  async addContact() {
    const { ctx, service, _id } = this
    ctx.validate({ user_id: 'string?', contact_id: 'string' })
    const id = ctx.request.body.user_id || _id
    const contactId = ctx.request.body.contact_id
    const res = await service.chat.addContact(id, contactId)
    ctx.reply(res)
  }

  /* DELETE
   * 删除联系人
   */
  async deleteContact() {
    const { ctx, service, _id } = this
    ctx.validate({ user_id: 'string?', contact_id: 'string' })
    const id = ctx.request.body.user_id || _id
    const res = await service.chat.deleteContact(id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取联系人列表
   */
  async getContactList() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.chat.getContactList(id)
    ctx.reply(res)
  }

  /* GET
   * 获取联系人信息
   */
  async getContactInfo() {
    const { ctx, service } = this
    ctx.validate({ user_id: 'string' }, ctx.query)
    const res = await service.chat.getContactInfo(ctx.query.user_id)
    ctx.reply(res)
  }

  /* GET
   * 获取聊天记录
   */
  async getChatData() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.chat.getChatData(id)
    ctx.reply(res)
  }
}

module.exports = ChatController
