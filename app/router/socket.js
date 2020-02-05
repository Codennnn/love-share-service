'use strict'

module.exports = app => {
  const { io } = app
  const { controller } = io
  const { action, chat } = controller

  io.route('setOnline', action.setOnline)
  io.route('sendMessage', chat.sendMessage)
}
