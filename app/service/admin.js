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
    const hashPassword = await this.ctx.genHash(data.password)
    data.password = hashPassword
    const admin = new this.ctx.model.Admin(data)
    try {
      await admin.save()
      return { code: 2001, msg: '成功创建管理员' }
    } catch (err) {
      if (err.message.includes('duplicate key error')) {
        if (err.message.includes('nickname')) {
          return { code: 3000, msg: '昵称已被使用' }
        }
        return { code: 3000, msg: '已注册管理员，请前往登录' }
      }
      return { code: 5000, msg: err.message }
    }
  }

  async resetPassword(_id, { password }) {
    const hashPassword = await this.ctx.genHash(password)
    const res = this.ctx.model.Admin
      .updateOne(
        { _id },
        { password: hashPassword }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2000, msg: '密码已重置' }
        }
        return { code: 3000, msg: '密码重置失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }
}

module.exports = AdminService
