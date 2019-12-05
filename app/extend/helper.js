'use strict'

module.exports = {
  parseMsg(message) {
    const [ target, client ] = [ message.client, message.target ]
    return {
      sender: Object.assign({}, message, {
        time: Date.now(),
      }),
      receiver: Object.assign({}, message, {
        time: Date.now(),
        is_sent: false,
        target,
        client,
      }),
    }
  },
}

// 聊天信息的格式
// {
//   is_sent: true,
//   type: 'text',  // 'text' || 'image' || 'audio' || 'video'
//   msg: '......',
//   client: 'nNx88r1c5WuHf9XuAAAB',
//   target: 'nNx88r1c5WuHf9XuAAAB',
//   time: 1512116201597,
// }
