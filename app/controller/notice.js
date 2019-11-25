'use strict'

const Controller = require('egg').Controller

class NoticeController extends Controller {
  /* GET
   * 获取通知列表
   */
  async getNoticeList() {
    const { ctx, service } = this
    const res = await service.notice.getNoticeList(ctx.state.user.id)
    ctx.reply(res)
  }
}

module.exports = NoticeController
