'use strict'

const Controller = require('egg').Controller

class ChatController extends Controller {
  async sendMessage() {
    const { ctx, app } = this
    const chat = app.io.of('/')
    const message = ctx.args[0] || {}

    try {
      const { target } = message
      if (!target) return
      const packet = ctx.helper.parseMsg(message)
      ctx.service.chat.addChatData(packet)
      chat.emit(target, packet.receiver)
    } catch (error) {
      app.logger.error(error)
    }
  }
}

module.exports = ChatController
