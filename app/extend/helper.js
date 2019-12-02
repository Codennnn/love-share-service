'use strict'

module.exports = {
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = Object.assign({}, {
      timestamp: Date.now(),
    }, metadata)

    return {
      meta,
      data: {
        action,
        payload,
      },
    }
  },
}

// 聊天信息的格式
// {
//   data: {
//     action: 'exchange',  // 'deny' || 'exchange' || 'broadcast'
//     payload: {},
//   },
//   meta:{
//     timestamp: 1512116201597,
//     client: 'nNx88r1c5WuHf9XuAAAB',
//     target: 'nNx88r1c5WuHf9XuAAAB'
//   },
// }
