'use strict'

const path = require('path')
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
    const { phone, password, nickname, real_name, school, roles = ['user'] } = data
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

  deleteUser(_id) {
    return this.ctx.model.User
      .deleteOne({ _id })
      .then(({ deletedCount }) => {
        if (deletedCount === 1) {
          return { code: 2000, msg: '删除用户成功' }
        }
        return { code: 3000, msg: '无任何用户被删除' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async getUserList(data) {
    const page = Number(data.page)
    const pageSize = Number(data.pageSize)
    const [total, user_list] = await Promise.all([
      this.ctx.model.User.estimatedDocumentCount(),
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
    return this.ctx.model.User
      .findOne({ _id }, '_id avatar_url nickname real_name introduction credit_value share_value phone email gender wechat qq roles fans follows collects')
      .populate('school', '-_id name')
      .then(user_info => {
        return { code: 2000, msg: '获取用户信息', data: { user_info } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getUserInfoNum(_id) {
    const { ctx, app } = this
    return ctx.model.User.aggregate([
      { $match: { _id: app.mongoose.Types.ObjectId(_id) } },
      {
        $project: {
          _id: 0,
          fans_num: { $size: '$fans' },
          collect_num: { $size: '$collects' },
          follow_num: { $size: '$follows' },
        },
      },
    ])
      .then(([res]) => {
        return { code: 2000, msg: '获取用户关注、粉丝、收藏的数量信息', data: { info_num: res } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getUserDetail(_id) {
    const { ctx, app } = this
    return ctx.model.User.aggregate([
      { $match: { _id: app.mongoose.Types.ObjectId(_id) } },
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
      .then(([user_detail]) => {
        user_detail.school = user_detail.school[0].name
        return { code: 2000, msg: '获取用户详细信息', data: { user_detail } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  modifyUser(_id, data) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $set: data },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '修改用户成功' }
        }
        return { code: 3000, msg: '无可用户被修改' }
      })
      .catch(err => {
        if (err.message.includes('nickname_1 dup key')) {
          return { code: 4003, msg: '该用户昵称已被使用' }
        }
        return { code: 5000, msg: err.message }
      })
  }

  updateUser(data) {
    return this.ctx.model.User
      .updateOne(
        { _id: data.user_id },
        { $set: data },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '数据更新成功' }
        }
        return { code: 3000, msg: '无可更新的数据' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async replaceAvatar(_id, stream) {
    const { app, ctx } = this
    const name = `avatar-${_id}-${path.basename(stream.filename)}`

    try {
      const { avatar_url: originalAvatar } = await ctx.model.User
        .findOne({ _id }, 'avatar_url')
      const { ok, url: avatar_url } = await app.fullQiniu
        .uploadStream(name, stream)
      if (ok) {
        return ctx.model.User
          .updateOne(
            { _id },
            { avatar_url }
          )
          .then(async ({ nModified }) => {
            if (nModified === 1) {
              const { ok } = await app.fullQiniu
                .delete(path.basename(originalAvatar))
              if (ok) {
                return { code: 2000, msg: '头像更换成功', data: { avatar_url } }
              }
              return { code: 4003, msg: '原头像删除失败' }
            }
            return { code: 3000, msg: '没有更换到头像' }
          })
      }
      return { code: 5000, msg: '头像更换失败：上传图片失败' }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  getAddressList(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'default_address address_list')
      .then(({ default_address, address_list }) => {
        return {
          code: 2000,
          msg: '获取收货地址',
          data: { default_address, address_list },
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  addAddress(_id, data) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $push: { address_list: data } },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功添加一个地址' }
        }
        return { code: 3000, msg: '没有添加任何地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  deleteAddress(_id, { address_id }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $pull: { address_list: { _id: address_id } } }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除一个地址' }
        }
        return { code: 3000, msg: '没有删除任何地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateAddress(
    _id,
    { _id: address_id, receiver, phone, address, type }
  ) {
    return this.ctx.model.User
      .updateOne(
        { _id, 'address_list._id': address_id },
        {
          $set: {
            'address_list.$.receiver': receiver,
            'address_list.$.phone': phone,
            'address_list.$.address': address,
            'address_list.$.type': type,
          },
        },
        { runValidators: true } // 开启更新验证器
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功修改一个地址' }
        }
        return { code: 3000, msg: '没有修改地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  setDefaultAddress(_id, { address_id }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { default_address: address_id },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功设置默认地址' }
        }
        return { code: 3000, msg: '没有设置默认地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  subscribe(_id, { user_id }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $addToSet: { follows: user_id } }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '关注成功' }
        }
        return { code: 3000, msg: '关注失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  unsubscribe(_id, { user_id }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $pull: { follows: user_id } }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '取消关注成功' }
        }
        return { code: 3000, msg: '取消关注失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async resetPassword({ phone, password }) {
    const hashPassword = await this.ctx.genHash(password)
    return this.ctx.model.User
      .updateOne(
        { phone },
        { password: hashPassword },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '密码已重置' }
        }
        return { code: 3000, msg: '密码重置失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getPublishedGoods(_id) {
    return this.ctx.model.Goods
      .find({ seller: _id }, 'img_list name price status created_at')
      .then(published_goods => {
        return { code: 2000, msg: '查询已发布的商品', data: { published_goods } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getCheckInList(_id) {
    return this.ctx.model.User
      .findOne({ _id }, '-_id check_in')
      .then(({ check_in: check_in_list }) => {
        return { code: 2000, data: { check_in_list }, msg: '查询签到列表' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  checkIn(_id, check_in) {
    return this.ctx.model.User
      .updateOne({ _id }, { $addToSet: { check_in } })
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '签到成功' }
        }
        return { code: 3000, msg: '签到成功' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getUserFollows(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'follows')
      .populate('follows', 'avatar_url nickname introduction')
      .then(({ follows }) => {
        return { code: 2000, msg: '查询关注的人', data: { follows } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = UserService
