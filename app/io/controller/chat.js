'use strict'

const Controller = require('egg').Controller

class ChatController extends Controller {
  async chat() {
    const { ctx, app } = this
    const chat = app.io.of('/')
    const message = ctx.args[0] || {}
    const socket = ctx.socket
    const client = socket.id
    console.log('chat 控制器打印', message)
    chat.emit('res', message)

    try {
      const { target, payload } = message
      if (!target) return
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target })
      chat.emit(target, msg)
    } catch (error) {
      app.logger.error(error)
    }
  }
}

module.exports = ChatController
