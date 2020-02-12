'use strict'

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
    } catch ({ status = 500, message = 'Internal Server Error', errors }) {
      // 是否为生产环境
      const isProd = (ctx.app.config.env === 'prod')

      const res = {
        code: -1,
        message: (status === 500 && isProd) ? 'Internal Server Error' : message,
      }

      // 参数校验未通过
      if (status === 422) {
        Object.assign(res, { errors })
      }

      ctx.reply(res, status)
    }
  }
}
