'use strict'

const Service = require('egg').Service

class AdminService extends Service {
  async signIn({ account, password }) {
    const { ctx, app } = this
    const res = await ctx.model.Admin.findOne({ account })

    if (res) {
      const { _id: id, password: hashPassword, roles } = res

      // 对比 hash 加密后的密码是否相等
      const isMatch = await ctx.compare(password, hashPassword)

      if (isMatch) {
        // 创建 JWT，有效期为7天
        const token = app.jwt.sign(
          { id, roles },
          app.config.jwt.secret,
          { expiresIn: '7d' }
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

  async getAdminList() {
    return this.ctx.model.Admin
      .find({}, 'avatar_url nickname real_name email gender roles permissions created_at updated_at')
      .then(admin_list => {
        return { code: 2000, msg: '获取管理员列表', data: { admin_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async resetPassword(_id, { password }) {
    const hashPassword = await this.ctx.genHash(password)
    return this.ctx.model.Admin
      .updateOne(
        { _id },
        { password: hashPassword },
        { runValidators: true }
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
  }

  async getAdminInfo(_id) {
    return this.ctx.model.Admin
      .findOne({ _id }, 'avatar_url nickname real_name email gender roles permissions created_at updated_at')
      .then(admin_info => {
        return { code: 2000, msg: '获取管理员信息', data: { admin_info } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async getAdminDetail(_id) {
    return this.ctx.model.Admin
      .findOne({ _id }, 'account avatar_url nickname real_name email gender roles permissions created_at updated_at')
      .then(admin_detail => {
        return { code: 2000, msg: '获取管理员信息', data: { admin_detail } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = AdminService
