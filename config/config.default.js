'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const config = (exports = {})

  config.proxy = true

  config.httpclient = {
    request: {
      timeout: 10000,
    },
  }

  config.cors = {
    // origin: '*',
    // allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
    origin: ctx => ctx.get('origin'),
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1561624248329_9612'

  config.middleware = ['errorHandler']

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
        '/api/admin/invitation',
        '/api/admin/sign_in',
        '/api/admin/sign_out',

        '/api/user/sign_in',
        '/api/user/sign_up',
        '/api/user/reset_password',

        '/api/begging/list',
        '/api/goods/list/recommend',
        '/api/goods/list/by_category',
        '/api/goods/detail',
        '/api/goods/seller',
        '/api/goods/comments',
        '/api/log/list',
        '/api/log/add',

        '/api/guide/list',
        '/api/guide/article/content',
        '/api/billboard/list',
        '/api/school/list',
        '/api/category/list',
        '/api/test',
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
