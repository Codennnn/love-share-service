'use strict'

const Service = require('egg').Service

class AdminService extends Service {
  async login(data) {
    const { ctx, app } = this
    const { account, password } = data

    let res = await ctx.model.User.find({ phone: account }).limit(1)

    if (res.length < 1) {
      res = await ctx.model.User.find({ email: account }).limit(1)
      if (res.length < 1) {
        return { code: 4001, msg: '手机号或邮箱尚未注册' }
      }
    }
    // 对比 hash 加密后的密码是否相等
    const isMatch = await ctx.compare(password, res[0].password)

    if (isMatch) {
      // 创建JWT，有效期为7天
      const token = app.jwt.sign(
        { id: res[0]._id },
        app.config.jwt.secret,
        { expiresIn: '7d' }
      )
      return { code: 2000, msg: '登录校验成功', data: { token } }
    }
    return { code: 4003, msg: '密码错误' }
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
