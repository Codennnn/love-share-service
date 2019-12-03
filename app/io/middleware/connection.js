'use strict'

module.exports = () => {
  return async (ctx, next) => {
    // const { socket } = ctx
    await next()
    // execute when disconnect.
    console.log('用户断开连接！')
  }
}
