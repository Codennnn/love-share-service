'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const config = (exports = {})

  config.proxy = true

  config.onerror = {
    all(err, ctx) {
      // JWT 过期
      if (err.message === 'jwt expired') {
        ctx.status = 418
      }
    },
  }

  config.httpclient = {
    request: {
      timeout: 10000,
    },
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1561624248329_9612'

  config.middleware = []

  config.security = {
    csrf: {
      enable: false, // 关闭安全威胁csrf防范
    },
  }

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/shop',
      options: {},
    },
  }

  config.validate = {
    convert: true,
    widelyUndefined: true,
  }

  config.multipart = {
    mode: 'stream',
  }

  config.fullQiniu = {
    default: {
      ak: '3-rQcEBU98OyMMbqevwb4xBEZAdNAhSHBTn-sGj6',
      sk: 'haJa1_93CdVaiL0eSHFRCE5vKPyUKRFR1c_lowDz',
      useCdnDomain: true,
      isLog: true,
    },
    app: true,
    agent: false,
    client: {
      zone: 'Zone_z2', // Zone_z2 华南
      bucket: 'love-share',
      baseUrl: 'https://cdn.hrspider.top/', // 用于拼接已上传文件的完整地址
    },
  }

  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ['connection'],
        packetMiddleware: [],
      },
    },
  }

  const userConfig = {
    myAppName: 'egg',

    bcrypt: {
      saltRounds: 10,
    },

    jwt: {
      secret: 'auth-token-secret',
      enable: true,
      ignore: [
        '/api/admin/sign_in',
        '/api/admin/sign_out',

        '/api/user/sign_in',
        '/api/user/sign_up',
        '/api/user/reset_password',

        '/api/billboard/list',
        '/api/school/list',
        '/api/category/list',
        '/api/common/check_nickname',
        '/api/common/check_phone_number',
      ],
    },
  }

  return {
    ...config,
    ...userConfig,
  }
}
