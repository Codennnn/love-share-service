'use strict'

const Service = require('egg').Service

class UserService extends Service {
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

  async createUser(data) {
    const { ctx } = this
    const { phone, password, nickname, real_name, school, roles = [ 'user' ] } = data
    const hashPassword = await ctx.genHash(password)
    let res
    await ctx.model.User
      .init()
      .then(async () => {
        res = await ctx.model.User
          .create({
            phone,
            password: hashPassword,
            nickname,
            real_name,
            school,
            roles,
          })
          .then(() => {
            return { code: 2001, msg: '成功创建用户' }
          })
          .catch(err => {
            console.log(err)
            if (err.message.includes('duplicate key error')) {
              return { code: 3000, msg: '该账号已注册，请前往登录' }
            }
            return { code: 3000, msg: err.message }
          })
      })
    return res
  }

  async deleteUser(id) {
    const res = await this.ctx.model.User.deleteOne({ _id: id })
    if (res.deletedCount === 1) {
      return { code: 2000, msg: '删除用户成功' }
    }
    return { code: 3000, msg: '无任何用户被删除' }
  }

  async getUserList(data) {
    const { page, pageSize } = data
    const total = await this.ctx.model.User.find().count()
    const res = await this.ctx.model.User
      .find({}, '_id avatar_url credit_value share_value nickname created_at')
      .skip((+page - 1) * pageSize)
      .limit(+pageSize)
    const pagination = {
      page: +page,
      pageSize: +pageSize,
      total,
    }
    return { code: 2000, msg: '查询所有用户', data: { user_list: res, pagination } }
  }

  async getUserInfo(_id) {
    try {
      const res = await this.ctx.model.User.aggregate(
        [
          { $match: { _id: this.ctx.app.mongoose.Types.ObjectId(_id) } },
          {
            $project: {
              avatar_url: 1,
              nickname: 1,
              real_name: 1,
              school: 1,
              introduction: 1,
              fans_num: { $size: '$fans' },
              collect_num: { $size: '$collects' },
              follow_num: { $size: '$follows' },
            },
          },
        ]
      )
      return { code: 2000, msg: '获取用户信息', data: { user_info: res } }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  async updateUser(data) {
    const res = await this.ctx.model.User
      .updateOne(
        { _id: data._id },
        { $set: data },
        { runValidators: true }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2004, msg: '数据更新成功' }
        }
        return { code: 3000, msg: '无可更新的数据' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  async getAddressList(_id) {
    try {
      const res = await this.ctx.model.User.find({ _id }, 'address_list')
      return { code: 2000, msg: '', data: { address_list: res } }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }
}

module.exports = UserService
