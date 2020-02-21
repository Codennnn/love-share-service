'use strict'

const sendToWormhole = require('stream-wormhole')
const Controller = require('egg').Controller

class UserController extends Controller {
  constructor(ctx) {
    super(ctx)
    if (ctx.state && ctx.state.user) {
      this._id = ctx.state.user.id
    }
  }

  /* POST
   * 用户登录
   */
  async signIn() {
    const { ctx, service } = this
    const data = ctx.request.body
    const res = await service.user.signIn(data)
    ctx.reply(res)
  }

  /* POST
   * 创建用户
   */
  async signUp() {
    const { ctx, service } = this
    ctx.validate({
      phone: 'string',
      password: { type: 'string', minlength: 6, maxlength: 16 },
    })
    const res = await service.user.createUser(ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除用户
   */
  async deleteUser() {
    const { ctx, service } = this
    const res = await service.user.deleteUser(ctx.request.body._id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户列表
   */
  async getUserList() {
    const { ctx, service } = this
    const res = await service.user.getUserList(ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 获取用户自身信息
   */
  async getUserInfo() {
    const { ctx, service, _id } = this
    const res = await service.user.getUserInfo(_id)
    ctx.reply(res)
  }

  /* GET
   * 获取其他用户信息
   */
  async getOtherUserInfo() {
    const { ctx, service } = this
    ctx.validate({ user_id: 'string' }, ctx.query)
    const res = await service.user.getOtherUserInfo(ctx.query.user_id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户的数量信息
   */
  async getUserInfoNum() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.user.getUserInfoNum(id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户详细信息
   */
  async getUserDetail() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.user.getUserDetail(id)
    ctx.reply(res)
  }

  /* PUT
   * 更新用户[客户端]
   */
  async modifyUser() {
    const { ctx, service, _id } = this
    const res = await service.user.modifyUser(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 更新用户 [管理端]
   */
  async updateUser() {
    const { ctx, service } = this
    ctx.validate({ user_id: 'string' })
    const res = await service.user.updateUser(ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取用户详情 [管理端]
   */
  async getUserDetailByAdmin() {
    const { ctx, service } = this
    ctx.validate({ user_id: 'string' }, ctx.query)
    const res = await service.user.getUserDetailByAdmin(ctx.query.user_id)
    ctx.reply(res)
  }

  /* PUT
   * 更换头像
   */
  async replaceAvatar() {
    const { ctx, service, _id } = this
    const stream = await ctx.getFileStream()
    try {
      const res = await service.user.replaceAvatar(_id, stream)
      ctx.reply(res)
    } catch (err) {
      await sendToWormhole(stream)
      throw err
    }
  }

  /* POST
   * 关注用户
   */
  async subscribe() {
    const { ctx, service, _id } = this
    ctx.validate({ user_id: 'string' })
    const data = ctx.request.body
    const res = await service.user.subscribe(_id, data)
    ctx.reply(res)
  }

  /* POST
   * 取消关注用户
   */
  async unsubscribe() {
    const { ctx, service, _id } = this
    const data = ctx.request.body
    const res = await service.user.unsubscribe(_id, data)
    ctx.reply(res)
  }

  /* POST
   * 重置用户密码
   */
  async resetPassword() {
    const { ctx, service } = this
    ctx.validate({ phone: 'string', password: 'string' })
    const res = await service.user.resetPassword(ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取用户已发布的商品
   */
  async getPublishedGoods() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.user.getPublishedGoods(id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户已购买的商品
   */
  async getBoughtGoods() {
    const { ctx, service, _id } = this
    const res = await service.user.getBoughtGoods(_id)
    ctx.reply(res)
  }

  /* GET
   * 获取签到列表
   */
  async getCheckInList() {
    const { ctx, service, _id } = this
    const res = await service.user.getCheckInList(_id)
    ctx.reply(res)
  }

  /* POST
   * 签到
   */
  async checkIn() {
    const { ctx, service, _id } = this
    const res = await service.user.checkIn(_id, ctx.request.body.check_in)
    ctx.reply(res)
  }

  /* GET
   * 获取用户关注的人
   */
  async getUserFollows() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.user.getUserFollows(id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户的粉丝
   */
  async getUserFans() {
    const { ctx, service, _id } = this
    const id = ctx.query.user_id || _id
    const res = await service.user.getUserFans(id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户收藏的商品
   */
  async getCollectionList() {
    const { ctx, service, _id } = this
    const res = await service.user.getCollectionList(_id)
    ctx.reply(res)
  }

  /* POST
   * 添加用户收藏的商品
   */
  async addCollection() {
    const { ctx, service, _id } = this
    ctx.validate({ goods_id: 'string' })
    const res = await service.user.addCollection(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 移除用户收藏的商品
   */
  async deleteCollection() {
    const { ctx, service, _id } = this
    ctx.validate({ goods_id: 'string' })
    const res = await service.user.deleteCollection(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 移除用户收藏的商品
   */
  async isUserFollowed() {
    const { ctx, service, _id } = this
    ctx.validate({ user_id: 'string' })
    const res = await service.user.isUserFollowed(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 更新用户乐享信用值
   */
  async updateCreditValue() {
    const { ctx, service, _id } = this
    ctx.validate({ value: 'number' })
    const res = await service.user.updateCreditValue(_id, ctx.request.body.value)
    ctx.reply(res)
  }

  /* PUT
   * 更新用户乐享值
   */
  async updateShareValue() {
    const { ctx, service, _id } = this
    ctx.validate({ value: 'number' })
    const res = await service.user.updateShareValue(_id, ctx.request.body.value)
    ctx.reply(res)
  }

  /* PUT
   * 更新用户乐豆数量
   */
  async updateBean() {
    const { ctx, service, _id } = this
    ctx.validate({ value: 'number' })
    const res = await service.user.updateBean(_id, ctx.request.body.value)
    ctx.reply(res)
  }

  /* GET
   * 获取每日新增用户的统计数据 [管理端]
   */
  async getUserDailyStatistics() {
    const { ctx, service } = this
    const res = await service.user.getUserDailyStatistics(ctx.request.body)
    ctx.reply(res)
  }

  /* POST
   * 用户充值余额
   */
  async rechargeBalance() {
    const { ctx, service, _id } = this
    ctx.validate({ balance: 'number', payment: 'string' })
    const res = await service.user.rechargeBalance(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 用户充值余额
   */
  async getBillList() {
    const { ctx, service, _id } = this
    const res = await service.user.getBillList(_id, ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = UserController
