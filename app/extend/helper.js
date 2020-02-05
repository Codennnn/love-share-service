'use strict'

module.exports = {
  parseMsg(message) {
    // 聊天信息的格式
    // 是否为发送方  is_sent: true,
    // 消息类型  type: 'text',
    // 消息内容  msg: '...',
    // 发送方  client: 'nNx88r1c5WuHf9XuAAAB',
    // 接收方  target: 'nNx88r1c5WuHf9XuAAAB',
    // 时间  time: 1512116201597,
    return {
      sender: Object.assign({}, message, {
        time: Date.now(),
      }),
      receiver: Object.assign({}, message, {
        time: Date.now(),
        is_sent: false,
        target: message.client,
        client: message.target,
      }),
    }
  },
}
