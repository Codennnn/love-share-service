'use strict'

const Controller = require('egg').Controller

class NoticeController extends Controller {
  /* POST
   * 获取未读消息
   */
  async addNotice() {
    const { ctx, service } = this
    try {
      ctx.validate({
        title: 'string',
        content: 'string',
        type: 'int',
      })
      const res = await service.notice.addNotice(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取未读消息
   */
  async getUnreadNotices() {
    const { ctx, service } = this
    const res = await service.notice.getUnreadNotices(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取通知列表
   */
  async getNoticeList() {
    const { ctx, service } = this
    const res = await service.notice.getNoticeList(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取通知列表
   */
  async setNoticeRead() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id: 'string' })
      const { notice_id } = ctx.request.body
      const res = await service.notice.setNoticeRead(ctx.state.user.id, notice_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = NoticeController
