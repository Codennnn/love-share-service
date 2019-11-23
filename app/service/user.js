'use strict'

const Service = require('egg').Service

class UserService extends Service {
  async signIn(data) {
    const { ctx, app } = this
    const { account, password } = data

    let res = await ctx.model.User.findOne({ phone: account })

    if (!res) {
      res = await ctx.model.User.findOne({ email: account })
      if (!res) {
        return { code: 4001, msg: '手机号或邮箱尚未注册' }
      }
    }
    // 对比 hash 加密后的密码是否相等
    const isMatch = await ctx.compare(password, res.password)

    if (isMatch) {
      // 创建 JWT，有效期为 30 天
      const token = app.jwt.sign(
        { id: res._id },
        app.config.jwt.secret,
        { expiresIn: '30d' }
      )
      return { code: 2000, msg: '登录校验成功', data: { token } }
    }
    return { code: 4003, msg: '密码错误' }
  }

  async createUser(data) {
    const { phone, password, nickname, real_name, school, roles = [ 'user' ] } = data
    const hashPassword = await this.ctx.genHash(password)
    const user = new this.ctx.model.User({
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
          return { code: 4002, msg: '手机号已注册' }
        } else if (err.message.includes('nickname')) {
          return { code: 4003, msg: '昵称已被使用' }
        }
        return { code: 5000, msg: err.message }
      }
      return { code: 5000, msg: err.message }
    }
  }

  async deleteUser(_id) {
    const res = await this.ctx.model.User.deleteOne({ _id })
    if (res.deletedCount === 1) {
      return { code: 2000, msg: '删除用户成功' }
    }
    return { code: 3000, msg: '无任何用户被删除' }
  }

  async getUserList(data) {
    const page = Number(data.page)
    const pageSize = Number(data.pageSize)
    const [ total, user_list ] = await Promise.all([
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
    return { code: 2000, msg: '查询用户列表', data: { user_list, pagination } }
  }

  getUserInfo(_id) {
    const res = this.ctx.model.User.aggregate([
      { $match: { _id: this.ctx.app.mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: 'schools',
          localField: 'school',
          foreignField: '_id',
          as: 'school',
        },
      },
      {
        $project: {
          _id: 0,
          avatar_url: 1,
          nickname: 1,
          real_name: 1,
          introduction: 1,
          roles: 1,
          'school.name': 1,
        },
      },
    ])
      .then(([ user_info ]) => {
        user_info.school = user_info.school[0].name
        return { code: 2000, msg: '获取用户信息', data: { user_info } }
      })

    return res
  }

  getUserInfoNum(_id) {
    const res = this.ctx.model.User.aggregate([
      { $match: { _id: this.ctx.app.mongoose.Types.ObjectId(_id) } },
      {
        $project: {
          _id: 0,
          fans_num: { $size: '$fans' },
          collect_num: { $size: '$collects' },
          follow_num: { $size: '$follows' },
        },
      },
    ])
      .then(([ res ]) => {
        return { code: 2000, msg: '获取用户关注、粉丝、收藏的数量信息', data: { info_num: res } }
      })
    return res
  }

  getUserDetail(_id) {
    const res = this.ctx.model.User.aggregate([
      { $match: { _id: this.ctx.app.mongoose.Types.ObjectId(_id) } },
      {
        $lookup: {
          from: 'schools',
          localField: 'school',
          foreignField: '_id',
          as: 'school',
        },
      },
      {
        $project: {
          _id: 0,
          nickname: 1,
          real_name: 1,
          credit_value: 1,
          share_value: 1,
          gender: 1,
          phone: 1,
          email: 1,
          wechat: 1,
          qq: 1,
          'school.name': 1,
        },
      },
    ])
      .then(([ user_detail ]) => {
        user_detail.school = user_detail.school[0].name
        return { code: 2000, msg: '获取用户详细信息', data: { user_detail } }
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

  async resetPassword(_id, data) {
    const hashPassword = await this.ctx.genHash(data.password)
    const res = this.ctx.model.User
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

module.exports = UserService
