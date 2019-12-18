'use strict'

const Service = require('egg').Service

class NoticeService extends Service {
  addNotice(_id, data) {
    const { ctx, app } = this
    data.time = Date.now()
    return ctx.model.User
      .updateOne(
        { _id },
        {
          $addToSet: { notices: data },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          app.io.of('/').emit('receiveNotice', data)
          return { code: 2000, msg: '成功添加一条通知' }
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  deleteNotice(_id, { notice_id }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        {
          $pull: { notices: { _id: notice_id } },
        }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除一条通知' }
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getUnreadNotices(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'notices')
      .then(({ notices }) => {
        const notice_list = notices.filter(el => !el.is_read)
        return { code: 2000, msg: '获取未通知', data: { notice_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getNoticeList(_id) {
    return this.ctx.model.User
      .findOne({ _id })
      .then(({ notices: notice_list }) => {
        return { code: 2000, msg: '获取通知列表', data: { notice_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  setNoticeRead(_id, noticeId) {
    return this.ctx.model.User
      .updateOne(
        { _id, 'notices._id': noticeId },
        {
          $set: { 'notices.$.is_read': true },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '全部通知已设为已读' }
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = NoticeService
