'use strict'

const Service = require('egg').Service

class ChatService extends Service {
  getContactList(_id) {
    return this.ctx.model.User
      .findOne({ _id })
      .populate('contacts', 'nickname avatar_url')
      .then(({ contacts: contact_list }) => {
        return { code: 2000, msg: '获取联系人列表', data: { contact_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getContactInfo(_id) {
    return this.ctx.model.User
      .findOne({ _id }, '_id avatar_url nickname')
      .then(contact_info => {
        return { code: 2000, msg: '获取联系人信息', data: { contact_info } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getChatData(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'chats')
      .then(({ chats = {} }) => {
        return { code: 2000, msg: '获取聊天记录', data: { chats } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = ChatService
