'use strict'

const Controller = require('egg').Controller

class NoticeController extends Controller {
  /* POST
   * 添加消息
   */
  async addNotice() {
    const { ctx, service } = this
    try {
      ctx.validate({
        title: 'string',
        content: 'string',
        // type: [1, 2, 3, 4],
        type: 'int',
      })
      const res = await service.notice.addNotice(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除消息
   */
  async deleteNotice() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id: 'string' })
      const res = await service.notice.deleteNotice(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除消息
   */
  async deleteManyNotices() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id_list: 'array' })
      const res = await service.notice.deleteManyNotices(ctx.state.user.id, ctx.request.body)
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
    const id = ctx.query.user_id || ctx.state.user.id
    const res = await service.notice.getUnreadNotices(id)
    ctx.reply(res)
  }

  /* GET
   * 获取通知列表
   */
  async getNoticeList() {
    const { ctx, service } = this
    try {
      ctx.validate({
        page: { type: 'int', min: 1 },
        page_size: { type: 'int', min: 1 },
      }, ctx.query)
      const res = await service.notice.getNoticeList(
        ctx.state.user.id,
        ctx.query
      )
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 通知设为已读
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

  /* PUT
   * 全部通知设为已读
   */
  async setAllNoticesRead() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id_list: 'array' })
      const res = await service.notice.setAllNoticesRead(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  // ===========================================================

  /* POST
   * 添加消息 [管理端]
   */
  async addNoticeByAdmin() {
    const { ctx, service } = this
    try {
      ctx.validate({
        title: 'string',
        content: 'string',
        // type: [1, 2, 3, 4],
        type: 'int',
      })
      const res = await service.notice.addNoticeByAdmin(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除消息 [管理端]
   */
  async deleteNoticeByAdmin() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id: 'string' })
      const res = await service.notice.deleteNoticeByAdmin(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除消息 [管理端]
   */
  async deleteManyNoticesByAdmin() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id_list: 'array' })
      const res = await service.notice.deleteManyNoticesByAdmin(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取未读消息 [管理端]
   */
  async getUnreadNoticesByAdmin() {
    const { ctx, service } = this
    const res = await service.notice.getUnreadNoticesByAdmin(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取通知列表 [管理端]
   */
  async getNoticeListByAdmin() {
    const { ctx, service } = this
    try {
      ctx.validate({
        page: { type: 'int', min: 1 },
        page_size: { type: 'int', min: 1 },
      }, ctx.query)
      const res = await service.notice.getNoticeListByAdmin(
        ctx.state.user.id,
        ctx.query
      )
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 通知设为已读 [管理端]
   */
  async setNoticeReadByAdmin() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id: 'string' })
      const { notice_id } = ctx.request.body
      const res = await service.notice.setNoticeReadByAdmin(ctx.state.user.id, notice_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 全部通知设为已读 [管理端]
   */
  async setAllNoticesReadByAdmin() {
    const { ctx, service } = this
    try {
      ctx.validate({ notice_id_list: 'array' })
      const res = await service.notice.setAllNoticesReadByAdmin(ctx.state.user.id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = NoticeController
