'use strict'

module.exports = app => {
  const { io } = app
  const { controller } = io

  io.route('setOnline', controller.action.setOnline)
  io.route('sendMessage', controller.chat.sendMessage)
}
