'use strict'

const Service = require('egg').Service

class ChatService extends Service {
  async addContact(_id, contact_id) {
    const count = await this.ctx.model.User.countDocuments({
      _id, contacts: { $in: [contact_id] },
    })

    if (count >= 1) {
      return { code: 5000, msg: '已存在联系人，不能重复添加！' }
    }

    return this.ctx.model.User
      .updateOne(
        { _id },
        {
          $addToSet: {
            contacts: contact_id,
            chats: { contact_id, msg: [] },
          },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功添加一个联系人' }
        }
        return { code: 3000, msg: '没有添加任何联系人' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  deleteContact(_id, contact_id) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        {
          $pull: {
            contacts: contact_id,
            chats: { contact_id },
          },
        }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除一个联系人' }
        }
        return { code: 3000, msg: '没有删除任何联系人' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getContactList(_id) {
    console.log(_id)
    return this.ctx.model.User
      .findOne({ _id }, 'contacts')
      .populate('contacts', 'nickname avatar_url')
      .then(({ contacts: contact_list = [] }) => {
        return { code: 2000, data: { contact_list }, msg: '获取联系人列表' }
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
      .then(({ chats }) => {
        const chatsData = {}
        chats.forEach(el => {
          chatsData[el.contact_id] = { msg: el.msg }
        })
        return { code: 2000, msg: '获取聊天记录', data: { chats: chatsData } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async addChatData({ sender, receiver }) {
    await Promise.all([
      // 更新发送方
      this.ctx.model.User
        .updateOne(
          { _id: sender.client, 'chats.contact_id': sender.target },
          {
            $addToSet: {
              'chats.$.msg': sender,
            },
          }
        ),
      // 更新接收方
      this.ctx.model.User
        .updateOne(
          { _id: receiver.client, 'chats.contact_id': receiver.target },
          {
            $addToSet: {
              'chats.$.msg': receiver,
            },
          }
        )
        .then(async ({ nModified }) => {
          // 如果是第一次聊天
          if (nModified === 0) {
            console.log('第一次聊天')
            const { code } = await this.addContact(receiver.client, receiver.target)
            if (code === 2000) {
              await this.ctx.model.User
                .updateOne(
                  { _id: receiver.client, 'chats.contact_id': receiver.target },
                  {
                    $addToSet: {
                      'chats.$.msg': receiver,
                    },
                  }
                )
            }
          }
        }),
    ])
  }
}

module.exports = ChatService
