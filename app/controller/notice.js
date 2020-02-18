'use strict'

const Controller = require('egg').Controller

class NoticeController extends Controller {
  constructor(ctx) {
    super(ctx)
    if (ctx.state && ctx.state.user) {
      this._id = ctx.state.user.id
    }
  }

  /* POST
   * 添加消息
   */
  async addNotice() {
    const { ctx, service, _id } = this
    ctx.validate({
      title: 'string',
      content: 'string',
      type: [1, 2, 3, 4],
      // type: 'int',
    })
    const res = await service.notice.addNotice(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除消息
   */
  async deleteNotice() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id: 'string' })
    const res = await service.notice.deleteNotice(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除消息
   */
  async deleteManyNotices() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id_list: 'array' })
    const res = await service.notice.deleteManyNotices(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取未读消息
   */
  async getUnreadNotices() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.notice.getUnreadNotices(id)
    ctx.reply(res)
  }

  /* GET
   * 获取通知列表
   */
  async getNoticeList() {
    const { ctx, service, _id } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, ctx.query)
    const res = await service.notice.getNoticeList(_id, ctx.query)
    ctx.reply(res)
  }

  /* PUT
   * 通知设为已读
   */
  async setNoticeRead() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id: 'string' })
    const { notice_id } = ctx.request.body
    const res = await service.notice.setNoticeRead(_id, notice_id)
    ctx.reply(res)
  }

  /* PUT
   * 全部通知设为已读
   */
  async setAllNoticesRead() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id_list: 'array' })
    const res = await service.notice.setAllNoticesRead(_id, ctx.request.body)
    ctx.reply(res)
  }

  // ===========================================================

  /* POST
   * 添加消息 [管理端]
   */
  async addNoticeByAdmin() {
    const { ctx, service, _id } = this
    ctx.validate({
      title: 'string',
      content: 'string',
      type: [1, 2, 3, 4],
      // type: 'int',
    })
    const res = await service.notice.addNoticeByAdmin(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除消息 [管理端]
   */
  async deleteNoticeByAdmin() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id: 'string' })
    const res = await service.notice.deleteNoticeByAdmin(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除消息 [管理端]
   */
  async deleteManyNoticesByAdmin() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id_list: 'array' })
    const res = await service.notice.deleteManyNoticesByAdmin(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取未读消息 [管理端]
   */
  async getUnreadNoticesByAdmin() {
    const { ctx, service, _id } = this
    const res = await service.notice.getUnreadNoticesByAdmin(_id)
    ctx.reply(res)
  }

  /* GET
   * 获取通知列表 [管理端]
   */
  async getNoticeListByAdmin() {
    const { ctx, service, _id } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, ctx.query)
    const res = await service.notice.getNoticeListByAdmin(_id, ctx.query)
    ctx.reply(res)
  }

  /* PUT
   * 通知设为已读 [管理端]
   */
  async setNoticeReadByAdmin() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id: 'string' })
    const { notice_id } = ctx.request.body
    const res = await service.notice.setNoticeReadByAdmin(_id, notice_id)
    ctx.reply(res)
  }

  /* PUT
   * 全部通知设为已读 [管理端]
   */
  async setAllNoticesReadByAdmin() {
    const { ctx, service, _id } = this
    ctx.validate({ notice_id_list: 'array' })
    const res = await service.notice.setAllNoticesReadByAdmin(_id, ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = NoticeController
