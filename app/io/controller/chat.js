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
      const msg = ctx.helper.parseMsg(message)
      // console.log(msg)
      chat.emit(target, msg)
    } catch (error) {
      app.logger.error(error)
    }
  }
}

module.exports = ChatController
