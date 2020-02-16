'use strict'

const path = require('path')
const Service = require('egg').Service

class AdminService extends Service {
  async createAdmin(data) {
    const hashPassword = await this.ctx.genHash(data.password)
    data.password = hashPassword
    const admin = new this.ctx.model.Admin(data)
    try {
      await admin.save()
      return { code: 2000, msg: '成功创建管理员' }
    } catch (err) {
      if (err.message.includes('duplicate key error')) {
        if (err.message.includes('nickname')) {
          return { code: 4002, msg: '昵称已被使用' }
        }
        return { code: 4003, msg: '已注册管理员，请前往登录' }
      }
      return { code: 5000, msg: err.message }
    }
  }

  async updateAdmin(data) {
    return this.ctx.model.Admin
      .updateOne(
        { _id: data.admin_id },
        { $set: data },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '管理员信息更新成功' }
        }
        return { code: 3000, msg: '无可更新的数据' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async signIn({ account, password, position, device }) {
    const { ctx, app } = this
    const res = await ctx.model.Admin.findOne({ account })

    if (res) {
      const { _id: id, password: hashPassword, permissions } = res

      // 对比 hash 加密后的密码是否相等
      const isMatch = await ctx.compare(password, hashPassword)

      if (isMatch) {
        // 更新登录时间
        await ctx.model.Admin.updateOne(
          { account },
          {
            $push: {
              sign_log: {
                $each: [{
                  position,
                  device,
                  ip: ctx.ip,
                }],
                $position: 0,
              },
            },
          }
        )

        // 创建 JWT，有效期为7天
        const token = app.jwt.sign(
          { id, permissions },
          app.config.jwt.secret,
          { expiresIn: '7d' }
        )
        return { code: 2000, msg: '登录校验成功', data: { token } }
      }
      return { code: 4003, msg: '密码错误' }
    }
    return { code: 4001, msg: '账号尚未注册' }
  }

  async getAdminList() {
    return this.ctx.model.Admin
      .find({}, 'account avatar_url nickname real_name gender created_at updated_at')
      .sort({ created_at: -1 })
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
      .findOne({ _id }, 'account user avatar_url nickname real_name email gender roles permissions lock_password created_at updated_at')
      .populate('user', 'nickname avatar_url')
      .then(admin_info => {
        return { code: 2000, msg: '获取管理员信息', data: { admin_info } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async getAdminDetail(_id) {
    return this.ctx.model.Admin
      .findOne({ _id }, 'account avatar_url nickname real_name email gender roles permissions sign_log created_at updated_at')
      .then(admin_detail => {
        return { code: 2000, msg: '获取管理员信息', data: { admin_detail } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async uploadAvatar(stream) {
    const name = `avatar-${path.basename(stream.filename)}`

    try {
      const { ok, url: avatar_url } = await this.app.fullQiniu
        .uploadStream(name, stream)
      if (ok) {
        return { code: 2000, msg: '头像上传成功', data: { avatar_url } }
      }
      return { code: 5000, msg: '头像上传失败' }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  async replaceAvatar({ admin_id: _id, avatar_url }) {
    const { app, ctx } = this
    try {
      const { avatar_url: originalAvatar } = await ctx.model.Admin
        .findOne({ _id }, 'avatar_url')
      return ctx.model.Admin
        .updateOne(
          { _id },
          { avatar_url }
        )
        .then(async ({ nModified }) => {
          if (nModified === 1) {
            if (
              originalAvatar === 'https://cdn.hrspider.top/default_avatar_female.jpg'
              || originalAvatar === 'https://cdn.hrspider.top/default_avatar_male.jpg'
            ) {
              return { code: 2000, msg: '头像更换成功' }
            }
            // 如果不是默认头像，则删除原来的头像
            const { ok } = await app.fullQiniu
              .delete(path.basename(originalAvatar))
            if (ok) {
              return { code: 2000, msg: '头像更换成功' }
            }
            return { code: 4003, msg: '原头像删除失败' }
          }
          return { code: 3000, msg: '没有更换到头像' }
        })
    } catch (err) {
      await app.fullQiniu.delete(path.basename(avatar_url))
      return { code: 5000, msg: err.message }
    }
  }

  async getSignLog(_id) {
    const { ctx } = this
    return ctx.model.Admin
      .findOne({ _id }, 'sign_log')
      .then(async ({ sign_log }) => {

        const log = await Promise.all(
          sign_log
            .slice(0, 5)
            .map(async ({ position = {}, device, created_at }) => {
              if (position.code === 1) {
                const url = `https://restapi.amap.com/v3/geocode/regeo?location=${position.longitude},${position.latitude}&key=a2b8126ee9e28679dc5d7757c7a458bd`
                const { data } = await ctx.curl(url, { dataType: 'json' })
                if (data.status === '1') {
                  Object.assign(position, data)
                  return {
                    position,
                    device,
                    created_at,
                  }
                }
                return {
                  device,
                  created_at,
                }
              }
              return {
                position,
                device,
                created_at,
              }
            })
        )

        return { code: 2000, msg: '获取管理员登录信息', data: { log } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async bindUser(_id, { account }) {
    const res = await this.ctx.model.User.findOne({
      $or: [
        { phone: account },
        { email: account },
      ],
    }, '_id')
    if (!res) {
      return { code: 4002, msg: '用户账号不存在' }
    }

    const count = await this.ctx.model.Admin.countDocuments({ user: res._id })
    if (count >= 1) {
      return { code: 4003, msg: '用户账号已被绑定' }
    }

    return this.ctx.model.Admin
      .updateOne(
        { _id },
        { user: res._id }
      )
      .then(async ({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功绑定一位用户' }
        }
      })
      .catch(err => {
        console.log(err)
        return { code: 3000, msg: '没有绑定任何用户' }
      })
  }

  unbindUser(_id) {
    return this.ctx.model.Admin
      .updateOne(
        { _id },
        { $set: { user: null } }
      )
      .then(async ({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '取消绑定成功' }
        }
      })
  }

  async updatePassword(_id, { old_pwd, new_pwd }) {
    const { ctx } = this
    const { password: hashPassword } = await ctx.model.Admin.findOne({ _id }, 'password')
    const isMatch = await ctx.compare(old_pwd, hashPassword)
    if (isMatch) {
      const hashPwd = await this.ctx.genHash(new_pwd)
      return ctx.model.Admin
        .updateOne(
          { _id },
          { password: hashPwd }
        )
        .then(async ({ nModified }) => {
          if (nModified === 1) {
            return { code: 2000, msg: '成功修改账号密码' }
          }
        })
    }
    return { code: 3000, msg: '原始密码错误' }
  }

  async updateLockPassword(_id, { password, lock_password }) {
    const { ctx } = this
    const res = await ctx.model.Admin.findOne({ _id }, 'password')

    // 对比 hash 加密后的密码是否相等
    const isMatch = await ctx.compare(password, res.password)

    if (isMatch) {
      return ctx.model.Admin
        .updateOne(
          { _id },
          { lock_password }
        )
        .then(async ({ nModified }) => {
          if (nModified === 1) {
            return { code: 2000, msg: '成功修改锁屏密码' }
          }
        })
    }
    return { code: 4003, msg: '登录密码有误' }
  }
}

module.exports = AdminService
