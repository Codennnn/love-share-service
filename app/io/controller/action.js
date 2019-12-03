'use strict'

const Controller = require('egg').Controller

class ActionController extends Controller {
  async setOnline() {
    const { ctx } = this
    const socket = ctx.socket
    console.log(socket.id)
  }
}

module.exports = ActionController
