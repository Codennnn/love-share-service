'use strict'

const path = require('path')
const Service = require('egg').Service

class UserService extends Service {
  async signIn({ account, password }) {
    const { ctx, app } = this
    const res = await ctx.model.User.findOne({
      $or: [
        { phone: account },
        { email: account },
      ],
    }, 'password')
    if (!res) {
      return { code: 4001, msg: '手机号或邮箱尚未注册' }
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
      return { code: 2000, msg: '成功创建用户' }
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
      .findOne({ _id }, '_id avatar_url nickname real_name introduction balance credit_value share_value beans phone email gender wechat qq roles')
      .populate('school', 'name')
      .then(user_info => {
        return { code: 2000, msg: '获取用户信息', data: { user_info } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getOtherUserInfo(_id) {
    return this.ctx.model.User
      .findOne({ _id }, '_id avatar_url nickname real_name introduction credit_value share_value phone email gender wechat qq')
      .populate('school', 'name')
      .then(user_info => {
        return { code: 2000, msg: '获取其他用户信息', data: { user_info } }
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
          collections_num: { $size: '$collections' },
          follows_num: { $size: '$follows' },
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

  async getUserDetailByAdmin(_id) {
    const { app, ctx, service } = this
    const [{ data: { published_goods } }, [user_detail]] = await Promise.all([
      service.user.getPublishedGoods(_id),
      ctx.model.User.aggregate([
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
            avatar_url: 1,
            nickname: 1,
            real_name: 1,
            credit_value: 1,
            share_value: 1,
            gender: 1,
            phone: 1,
            email: 1,
            wechat: 1,
            qq: 1,
            introduction: 1,
            fans_num: { $size: '$fans' },
            follow_num: { $size: '$follows' },
            'school._id': 1,
            'school.name': 1,
            balance: 1,
            beans: 1,
          },
        },
      ]),
    ])
    Object.assign(
      user_detail,
      { school: user_detail.school[0], published_goods }
    )
    return {
      code: 2000,
      msg: '管理员获取用户详情',
      data: { user_detail },
    }
  }

  async replaceAvatar(_id, stream) {
    const { app, ctx } = this
    const name = `avatar-${_id}-${path.basename(stream.filename)}`

    try {
      const { avatar_url: originalAvatar } = await ctx.model.User
        .findOne({ _id }, 'avatar_url')
      const { ok, url } = await app.fullQiniu
        .uploadStream(name, stream)
      if (ok) {
        if (originalAvatar.length > 0) {
          const { ok } = await app.fullQiniu
            .delete(path.basename(originalAvatar))
          if (!ok) {
            return { code: 4003, msg: '原头像删除失败' }
          }
        }
        return ctx.model.User
          .updateOne(
            { _id },
            { avatar_url: decodeURI(url) }
          )
          .then(async ({ nModified }) => {
            if (nModified === 1) {
              return { code: 2000, msg: '头像更换成功', data: { avatar_url: decodeURI(url) } }
            }
            return { code: 3000, msg: '没有更换到头像' }
          })
      }
      return { code: 5000, msg: '头像更换失败：上传图片失败' }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  async subscribe(_id, { user_id }) {
    const res = await Promise.all([
      this.ctx.model.User
        .updateOne(
          { _id },
          { $push: { follows: { $each: [{ user: user_id }], $position: 0 } } }
        ),
      this.ctx.model.User
        .updateOne(
          { _id: user_id },
          { $push: { fans: { $each: [{ user: _id }], $position: 0 } } }
        ),
    ])

    if (res.every(el => el.nModified === 1)) {
      return { code: 2000, msg: '关注成功' }
    }
    return { code: 3000, msg: '关注失败' }
  }

  async unsubscribe(_id, { user_id }) {
    const res = await Promise.all([
      this.ctx.model.User
        .updateOne(
          { _id },
          { $pull: { follows: { user: user_id } } }
        ),
      this.ctx.model.User
        .updateOne(
          { _id: user_id },
          { $pull: { fans: { user: _id } } }
        ),
    ])

    if (res.every(el => el.nModified === 1)) {
      return { code: 2000, msg: '取消关注成功' }
    }
    return { code: 3000, msg: '取消关注失败' }
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
    return this.ctx.model.User
      .findOne({ _id }, 'published_goods')
      .populate({
        path: 'published_goods',
        select: 'img_list name price status buyer created_at updated_at',
      })
      .then(({ published_goods }) => {
        return { code: 2000, msg: '查询已发布的商品', data: { published_goods } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getBoughtGoods(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'bought_goods')
      .populate({
        path: 'bought_goods',
        select: 'img_list name price status created_at updated_at sell_time',
        populate: { path: 'seller', select: 'nickname' },
      })
      .then(({ bought_goods }) => {
        return { code: 2000, msg: '查询已购买的商品', data: { bought_goods } }
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
    const { ctx, service } = this
    return ctx.model.User
      .updateOne(
        { _id },
        { $push: { check_in: { $each: [check_in], $position: 0 } } }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          service.user.updateBean(_id, 10)
          return { code: 2000, msg: '签到成功' }
        }
        return { code: 3000, msg: '签到失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getUserFollows(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'follows')
      .populate('follows.user', 'avatar_url nickname introduction')
      .then(({ follows }) => {
        return { code: 2000, msg: '查询关注的人', data: { follows } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getUserFans(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'fans')
      .populate('fans.user', 'avatar_url nickname introduction')
      .then(({ fans }) => {
        return { code: 2000, msg: '查询关注的人', data: { fans } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  getCollectionList(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'collections')
      .populate({
        path: 'collections.goods',
        select: 'img_list name quantity category price created_at status',
      })
      .then(({ collections }) => {
        return { code: 2000, msg: '获取收藏夹', data: { collections } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async addCollection(_id, { goods_id }) {
    const { ctx } = this
    return ctx.model.User
      .updateOne(
        { _id },
        { $push: { collections: { $each: [{ goods: goods_id }], $position: 0 } } },
        { runValidators: true }
      )
      .then(async ({ nModified }) => {
        const { nModified: nM } = await ctx.model.Goods.updateOne(
          { _id: goods_id },
          { $inc: { collect_num: 1 } }
        )
        if (nModified === 1 && nM === 1) {
          return { code: 2000, msg: '已成功添加一个收藏' }
        }
        return { code: 3000, msg: '添加收藏失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  deleteCollection(_id, { goods_id }) {
    const { ctx } = this
    return ctx.model.User
      .updateOne(
        { _id },
        { $pull: { collections: { goods: goods_id } } }
      )
      .then(async ({ nModified }) => {
        const { nModified: nM } = await ctx.model.Goods.updateOne(
          { _id: goods_id },
          { $inc: { collect_num: -1 } }
        )
        if (nModified === 1 && nM === 1) {
          return { code: 2000, msg: '已成功移除一个收藏' }
        }
        return { code: 3000, msg: '移除收藏失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  isUserFollowed(_id, { user_id }) {
    return this.ctx.model.User
      .findOne({ _id }, 'follows')
      .then(({ follows = [] }) => {
        const is_followed = follows.some(el => String(el.user) === user_id)
        return { code: 2000, msg: '是否关注了此用户', data: { is_followed } }
      })
  }

  updateCreditValue(_id, value) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $inc: { credit_value: value } },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '修改用户乐享信用值成功' }
        }
        return { code: 3000, msg: '无任何用户乐享信用值被修改' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateShareValue(_id, value) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $inc: { share_value: value } },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '修改用户乐享值成功' }
        }
        return { code: 3000, msg: '无任何用户乐享值被修改' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateBean(_id, value) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $inc: { beans: value } },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '修改用户乐豆数量成功' }
        }
        return { code: 3000, msg: '无任何用户乐豆数量被修改' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async getUserDailyStatistics({ date_list }) {
    const data = await Promise.all(date_list.map(
      el => this.ctx.model.User
        .countDocuments({
          created_at: {
            $gte: new Date(`${el} 00:00:00`),
            $lte: new Date(`${el} 23:59:59`),
          },
        })
    ))
    return {
      code: 2000,
      msg: '获取新增用户统计数据',
      data: {
        series: [{
          name: '用户数量',
          data,
        }],
      },
    }
  }

  async rechargeBalance(_id, { balance, payment }) {
    try {
      const [res] = await Promise.all([
        this.ctx.model.User
          .updateOne(
            { _id },
            { $inc: { balance } },
            { runValidators: true }
          ),
        this.ctx.model.User
          .updateOne(
            { _id },
            { $push: { bill: { $each: [{ balance, payment }], $position: 0 } } },
            { runValidators: true }
          ),
      ])

      if (res.nModified === 1) {
        return { code: 2000, msg: `余额充值成功，已充值 ￥${Number(balance).toFixed(2)}`, data: { balance } }
      }
      return { code: 3000, msg: '用户余额充值失败' }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  getBillList(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'bill')
      .then(({ bill: bill_list }) => {
        return { code: 2000, msg: '获取账单列表', data: { bill_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = UserService
