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
    const user = new ctx.model.User({
      phone,
      password: hashPassword,
      nickname,
      real_name,
      school,
      roles,
    })
    try {
      await user.save()
      return { code: 2001, msg: '成功创建用户' }
    } catch (err) {
      if (err.message.includes('duplicate key error')) {
        if (err.message.includes('phone')) {
          return { code: 5000, msg: '手机号已注册' }
        } else if (err.message.includes('nickname')) {
          return { code: 5000, msg: '昵称已被使用' }
        }
        return { code: 5000, msg: err.message }
      }
      return { code: 5000, msg: err.message }
    }
  }

  async deleteUser(id) {
    const res = await this.ctx.model.User.deleteOne({ _id: id })
    if (res.deletedCount === 1) {
      return { code: 2000, msg: '删除用户成功' }
    }
    return { code: 3000, msg: '无任何用户被删除' }
  }

  async getUserList(data) {
    const page = Number(data.page)
    const pageSize = Number(data.pageSize)
    const [ total, res ] = await Promise.all([
      this.ctx.model.User.find().count(),
      this.ctx.model.User
        .find({}, '_id avatar_url credit_value share_value nickname created_at')
        .skip((page - 1) * pageSize)
        .limit(pageSize),
    ])
    const pagination = {
      page,
      pageSize,
      total,
    }
    return { code: 2000, msg: '查询所有用户', data: { user_list: res, pagination } }
  }

  async getUserInfo(_id) {
    const res = await this.ctx.model.User.aggregate([
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
    ])
      .then(res => {
        return { code: 2000, msg: '获取用户信息', data: { user_info: res[0] } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  updateUser(_id, data) {
    const res = this.ctx.model.User
      .updateOne(
        { _id },
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

  getAddressList(_id) {
    const res = this.ctx.model.User
      .find({ _id }, 'default_address address_list')
      .then(res => {
        const { default_address, address_list } = res[0]
        return { code: 2000, msg: '获取收货地址', data: { default_address, address_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  addAddress(_id, data) {
    const res = this.ctx.model.User
      .updateOne(
        { _id },
        { $push: { address_list: data } },
        { runValidators: true }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2000, msg: '成功添加一个地址' }
        }
        return { code: 3000, msg: '没有添加地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  deleteAddress(_id, data) {
    const res = this.ctx.model.User
      .updateOne(
        { _id },
        { $pull: { address_list: { _id: data.address_id } } }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2000, msg: '成功删除一个地址' }
        }
        return { code: 3000, msg: '没有删除地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  updateAddress(_id, data) {
    const res = this.ctx.model.User
      .updateOne(
        { _id, 'address_list._id': data.address_id },
        {
          $set: {
            'address_list.$.receiver': data.receiver,
            'address_list.$.phone': data.phone,
            'address_list.$.address': data.address,
            'address_list.$.address_type': data.address_type,
          },
        },
        { runValidators: true } // 开启更新验证器
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2000, msg: '成功修改一个地址' }
        }
        return { code: 3000, msg: '没有修改地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  setDefaultAddress(_id, data) {
    const res = this.ctx.model.User
      .updateOne(
        { _id },
        { default_address: data.address_id }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2000, msg: '成功设置默认地址' }
        }
        return { code: 3000, msg: '没有设置默认地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  subscribe(_id, data) {
    if (_id === data.user_id) {
      return { code: 4003, msg: '不能关注自己' }
    }
    const res = this.ctx.model.User
      .updateOne(
        { _id },
        { $addToSet: { follows: data.user_id } }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2000, msg: '关注成功' }
        }
        return { code: 3000, msg: '关注失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }

  unsubscribe(_id, data) {
    const res = this.ctx.model.User
      .updateOne(
        { _id },
        { $pull: { follows: data.user_id } }
      )
      .then(res => {
        if (res.nModified === 1) {
          return { code: 2000, msg: '取消关注成功' }
        }
        return { code: 3000, msg: '取消关注失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
    return res
  }
}

module.exports = UserService
