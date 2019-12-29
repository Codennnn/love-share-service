'use strict'

const sendToWormhole = require('stream-wormhole')
const Controller = require('egg').Controller

class UserController extends Controller {
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
    const data = ctx.request.body
    const res = await service.user.createUser(data)
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
    const data = ctx.request.query
    const res = await service.user.getUserList(data)
    ctx.reply(res)
  }

  /* GET
   * 获取用户自身信息
   */
  async getUserInfo() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const res = await service.user.getUserInfo(id)
    ctx.reply(res)
  }

  /* GET
   * 获取其他用户信息
   */
  async getOtherUserInfo() {
    const { ctx, service } = this
    try {
      ctx.validate({ user_id: 'string' }, ctx.request.query)
      const res = await service.user.getOtherUserInfo(ctx.request.query.user_id)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取用户的数量信息
   */
  async getUserInfoNum() {
    const { ctx, service } = this
    const id = ctx.request.query.user_id || ctx.state.user.id
    const res = await service.user.getUserInfoNum(id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户详细信息
   */
  async getUserDetail() {
    const { ctx, service } = this
    const id = ctx.request.query.user_id || ctx.state.user.id
    const res = await service.user.getUserDetail(id)
    ctx.reply(res)
  }

  /* PUT
   * 更新用户[客户端]
   */
  async modifyUser() {
    const { ctx, service } = this
    const res = await service.user.modifyUser(
      ctx.state.user.id,
      ctx.request.body
    )
    ctx.reply(res)
  }

  /* PUT
   * 更新用户[管理端]
   */
  async updateUser() {
    const { ctx, service } = this
    try {
      ctx.validate({ user_id: 'string' })
      const res = await service.user.updateUser(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 更换头像
   */
  async replaceAvatar() {
    const { ctx, service } = this
    const stream = await ctx.getFileStream()
    try {
      const res = await service.user.replaceAvatar(ctx.state.user.id, stream)
      ctx.reply(res)
    } catch {
      await sendToWormhole(stream)
    }
  }

  /* POST
   * 关注用户
   */
  async subscribe() {
    const { ctx, service } = this

    try {
      ctx.validate({ user_id: 'string' })
      const id = ctx.state.user.id
      const data = ctx.request.body
      const res = await service.user.subscribe(id, data)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* POST
   * 取消关注用户
   */
  async unsubscribe() {
    const { ctx, service } = this
    const id = ctx.state.user.id
    const data = ctx.request.body
    const res = await service.user.unsubscribe(id, data)
    ctx.reply(res)
  }

  /* POST
   * 重置用户密码
   */
  async resetPassword() {
    const { ctx, service } = this

    try {
      ctx.validate({ phone: 'string', password: 'string' })
      const res = await service.user.resetPassword(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取用户已发布的商品
   */
  async getPublishedGoods() {
    const { ctx, service } = this
    const res = await service.user.getPublishedGoods(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户已购买的商品
   */
  async getPurchasedGoods() {
    const { ctx, service } = this
    const res = await service.user.getPurchasedGoods(ctx.state.user.id)
    ctx.reply(res)
  }

  /* GET
   * 获取签到列表
   */
  async getCheckInList() {
    const { ctx, service } = this
    const res = await service.user.getCheckInList(ctx.state.user.id)
    ctx.reply(res)
  }

  /* POST
   * 签到
   */
  async checkIn() {
    const { ctx, service } = this
    const res = await service.user.checkIn(ctx.state.user.id, ctx.request.body.check_in)
    ctx.reply(res)
  }

  /* GET
   * 获取用户关注的人
   */
  async getUserFollows() {
    const { ctx, service } = this
    const id = ctx.request.query.user_id || ctx.state.user.id
    const res = await service.user.getUserFollows(id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户的粉丝
   */
  async getUserFans() {
    const { ctx, service } = this
    const id = ctx.request.query.user_id || ctx.state.user.id
    const res = await service.user.getUserFans(id)
    ctx.reply(res)
  }

  /* GET
   * 获取用户收藏的商品
   */
  async getCollectionList() {
    const { ctx, service } = this
    const res = await service.user.getCollectionList(ctx.state.user.id)
    ctx.reply(res)
  }

  /* POST
   * 添加用户收藏的商品
   */
  async addCollection() {
    const { ctx, service } = this
    try {
      ctx.validate({ goods_id: 'string' })
      const id = ctx.state.user.id
      const res = await service.user.addCollection(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 移除用户收藏的商品
   */
  async deleteCollection() {
    const { ctx, service } = this
    try {
      ctx.validate({ goods_id: 'string' })
      const id = ctx.state.user.id
      const res = await service.user.deleteCollection(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 移除用户收藏的商品
   */
  async isUserFollowed() {
    const { ctx, service } = this
    try {
      ctx.validate({ user_id: 'string' })
      const id = ctx.state.user.id
      const res = await service.user.isUserFollowed(id, ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = UserController
