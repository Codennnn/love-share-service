'use strict'

const Service = require('egg').Service

class AdminService extends Service {
  async login(data) {
    const { ctx, app } = this
    const { account, password } = data

    const res = await ctx.model.Admin.find({ account }).limit(1)

    if (res.length === 1) {
      const { _id: id, password: hashPassword } = res[0]

      // 对比 hash 加密后的密码是否相等
      const isMatch = await ctx.compare(password, hashPassword)

      if (isMatch) {
        // 创建 JWT，有效期为7天
        const token = app.jwt.sign(
          { id },
          app.config.jwt.secret,
          { expiresIn: '30d' }
        )
        return { code: 2000, msg: '登录校验成功', data: { token } }
      }
      return { code: 4003, msg: '密码错误' }
    }
    return { code: 4001, msg: '账号尚未注册' }
  }

  async createAdmin(data) {
    const { ctx } = this
    const hashPassword = await ctx.genHash(data.password)
    data.password = hashPassword
    let res
    await ctx.model.Admin
      .init()
      .then(async () => {
        res = await ctx.model.Admin
          .create(data)
          .then(() => {
            return { code: 2001, msg: '创建管理员成功' }
          })
          .catch(err => {
            if (err.message.includes('duplicate key error')) {
              return { code: 3000, msg: '该账号已注册，请前往登录' }
            }
            return { code: 3000, msg: err.message }
          })
      })
    return res
  }
}

module.exports = AdminService
