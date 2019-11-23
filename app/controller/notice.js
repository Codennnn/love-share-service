'use strict'

const Controller = require('egg').Controller

class NoticeController extends Controller {
  /* GET
   * 获取通知列表
   */
  async getNoticeList() {
    const { ctx, service } = this
    const res = await service.notice.getNoticeList(ctx.state.user.id)

    ctx.body = res
    ctx.status = 200
  }
}

module.exports = NoticeController
