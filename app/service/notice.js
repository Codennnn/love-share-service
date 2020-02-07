'use strict'

const Service = require('egg').Service

class NoticeService extends Service {
  addNotice(_id, data) {
    // data: {
    //   title: '您有一件闲置被买走啦',
    //   content: `您发布的闲置物品 <b>${el.name}</b> 被人拍走啦~`,
    //   type: 2,
    // }
    data.time = Date.now()
    const { app, ctx } = this
    return ctx.model.User
      .updateOne(
        { _id },
        {
          $push: { notices: { $each: [data], $position: 0 } },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          app.io.of('/').emit(`receiveNotice${_id}`, data)
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

  deleteManyNotices(_id, { notice_id_list }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        {
          $pull: { notices: { _id: { $in: notice_id_list } } },
        }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除多条通知' }
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

  getNoticeList(_id, { page, page_size }) {
    return this.ctx.model.User
      .findOne({ _id }, { notices: { $slice: [(page - 1) * page_size, page_size] } })
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

  async setAllNoticesRead(_id, { notice_id_list: list }) {
    const res = await Promise.all(list.map(id => this.ctx.model.User.updateOne(
      { _id, 'notices._id': id },
      {
        $set: { 'notices.$.is_read': true },
      },
      { runValidators: true }
    )))

    if (res.every(({ nModified }) => nModified === 1)) {
      return { code: 2000, msg: '全部通知设为已读' }
    }
    return { code: 3000, msg: '全部通知设为已读失败' }
  }

  // =========================================================

  addNoticeByAdmin(_id, data) {
    const { app, ctx } = this
    return ctx.model.Admin
      .updateOne(
        { _id },
        {
          $push: { notices: { $each: [data], $position: 0 } },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          app.io.of('/').emit(`receiveNotice${_id}`, data)
          return { code: 2000, msg: '成功添加一条通知' }
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  deleteNoticeByAdmin(_id, { notice_id }) {
    return this.ctx.model.Admin
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

  deleteManyNoticesByAdmin(_id, { notice_id_list }) {
    return this.ctx.model.Admin
      .updateOne(
        { _id },
        {
          $pull: { notices: { _id: { $in: notice_id_list } } },
        }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除多条通知' }
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getUnreadNoticesByAdmin(_id) {
    return this.ctx.model.Admin
      .findOne({ _id }, 'notices')
      .then(({ notices }) => {
        const notice_list = notices.filter(el => !el.is_read)
        return { code: 2000, msg: '获取未通知', data: { notice_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getNoticeListByAdmin(_id, { page, page_size }) {
    return this.ctx.model.Admin
      .findOne({ _id }, { notices: { $slice: [(page - 1) * page_size, page_size] } })
      .then(({ notices: notice_list }) => {
        return { code: 2000, msg: '获取通知列表', data: { notice_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  setNoticeReadByAdmin(_id, noticeId) {
    return this.ctx.model.Admin
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

  async setAllNoticesReadByAdmin(_id, { notice_id_list: list }) {
    const res = await Promise.all(list.map(id => this.ctx.model.Admin.updateOne(
      { _id, 'notices._id': id },
      {
        $set: { 'notices.$.is_read': true },
      },
      { runValidators: true }
    )))

    if (res.every(({ nModified }) => nModified === 1)) {
      return { code: 2000, msg: '全部通知设为已读' }
    }
    return { code: 3000, msg: '全部通知设为已读失败' }
  }
}

module.exports = NoticeService
