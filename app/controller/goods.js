'use strict'

const Controller = require('egg').Controller

class GoodsController extends Controller {
  constructor(ctx) {
    super(ctx)
    if (ctx.state && ctx.state.user) {
      this._id = ctx.state.user.id
    }
  }

  /* GET
   * 创建商品
   */
  async createGoods() {
    const { ctx, service, _id } = this
    ctx.validate({
      img_list: { type: 'array', itemType: 'string' },
      price: 'number',
      original_price: 'number',
      quantity: 'number',
      delivery: 'string',
      description: { type: 'string', max: 400, required: false },
      can_bargain: 'boolean',
      can_return: 'boolean',
    })
    const res = await service.goods.createGoods(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除商品
   */
  async deleteGoods() {
    const { ctx, service } = this
    ctx.validate({ goods_id: 'string' })
    const res = await service.goods.deleteGoods(ctx.request.body.goods_id)
    ctx.reply(res)
  }

  /* PUT
   * 更新商品信息
   */
  async updateGoods() {
    const { ctx, service } = this
    const res = await service.goods.updateGoods(ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 更新多件商品信息
   */
  async updateManyGoods() {
    const { ctx, service } = this
    ctx.validate({
      goods_id_list: { type: 'array', itemType: 'string' },
    })
    const res = await service.goods.updateManyGoods(ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 编辑商品信息
   */
  async editGoods() {
    const { ctx, service, _id } = this
    ctx.validate({
      img_list: { type: 'array', itemType: 'string' },
      price: 'number',
      original_price: 'number',
      quantity: 'number',
      delivery: 'string',
      description: { type: 'string', max: 400, required: false },
      can_bargain: 'boolean',
      can_return: 'boolean',
    })
    const res = await service.goods.editGoods(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取推荐商品列表
   */
  async getRecommendGoodsList() {
    const { ctx, service, _id } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: 'int',
    }, ctx.query)
    const res = await service.goods.getRecommendGoodsList(_id, ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 通过商品名搜索获取商品列表
   */
  async getGoodsListBySearch() {
    const { ctx, service } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
      search: 'string',
    }, ctx.query)
    const res = await service.goods.getGoodsListBySearch(ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 获取某分类的商品列表
   */
  async getGoodsListByCategory() {
    const { ctx, service } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
      category: 'string',
    }, ctx.query)
    const res = await service.goods.getGoodsListByCategory(ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 获取同校商品列表
   */
  async getGoodsListBySchoolOrCategory() {
    const { ctx, service } = this
    ctx.validate({
      school_id: 'string',
      category: 'array?',
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    })
    const res = await service.goods.getGoodsListBySchoolOrCategory(ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取商品详情
   */
  async getGoodsDetail() {
    const { ctx, service } = this
    ctx.validate({ goods_id: 'string', viewed: 'number?' }, ctx.query)
    const res = await service.goods.getGoodsDetail(ctx.query)
    ctx.reply(res)
  }

  /* POST
   * 图片上传
   */
  async uploadImg() {
    const { ctx, service, _id } = this
    const parts = ctx.multipart()
    const res = await service.goods.uploadImg(_id, parts)
    ctx.reply(res)
  }

  /* DELETE
   * 删除已上传的图片
   */
  async deleteImg() {
    const { ctx, service } = this
    ctx.validate({ img_list: 'array' })
    const res = await service.goods.deleteImg(ctx.request.body.img_list)
    ctx.reply(res)
  }

  /* GET
   * 获取商品的卖家信息
   */
  async getGoodsSeller() {
    const { ctx, service } = this
    ctx.validate({ goods_id: 'string' }, ctx.query)
    const res = await service.goods.getGoodsSeller(ctx.query.goods_id)
    ctx.reply(res)
  }

  /* GET
   * 获取商品的评论
   */
  async getGoodsComments() {
    const { ctx, service } = this
    ctx.validate({
      goods_id: 'string',
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, ctx.query)
    const res = await service.goods.getGoodsComments(ctx.query)
    ctx.reply(res)
  }

  /* POST
   * 发表评论
   */
  async postComment() {
    const { ctx, service } = this
    ctx.validate({
      owner: 'string',
      content: { type: 'string', max: 50 },
      goods_id: 'string',
    })
    const res = await service.goods.postComment(ctx.state.user.id, ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 修改评论
   */
  async changeComment() {
    const { ctx, service } = this
    ctx.validate({
      goods_id: 'string',
      comment_id: 'string',
      content: { type: 'string', max: 50 },
    })
    const res = await service.goods.changeComment(ctx.state.user.id, ctx.request.body)
    ctx.reply(res)
  }

  /* POST
   * 回复别人
   */
  async replyComment() {
    const { ctx, service } = this
    ctx.validate({
      goods_id: 'string',
      comment_id: 'string',
      at: 'string',
      content: { type: 'string', min: 1, max: 50 },
    })
    const res = await service.goods.replyComment(ctx.state.user.id, ctx.request.body)
    ctx.reply(res)
  }

  /* POST
   * 发表商品评价
   */
  async postReview() {
    const { ctx, service } = this
    ctx.validate({ reviews: 'array' })
    const res = await service.goods.postReview(ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 是否收藏了该商品
   */
  async isGoodsCollected() {
    const { ctx, service, _id } = this
    ctx.validate({ goods_id: 'string' })
    const res = await service.goods.isGoodsCollected(_id, ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取商品列表信息 [管理端]
   */
  async getGoodsListInfo() {
    const { ctx, service } = this
    const res = await service.goods.getGoodsListInfo()
    ctx.reply(res)
  }

  /* GET
   * 获取已上架的商品列表 [管理端]
   */
  async getGoodsListOnSell() {
    const { ctx, service } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, ctx.query)
    const res = await service.goods.getGoodsListByStatus(1, ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 获取已下架的商品列表 [管理端]
   */
  async getGoodsListOffSell() {
    const { ctx, service } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, ctx.query)
    const res = await service.goods.getGoodsListByStatus(3, ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 根据日期范围搜索商品列表 [管理端]
   */
  async getGoodsListByDateRange() {
    const { ctx, service } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
      date_range: 'array',
    })
    const res = await service.goods.getGoodsListByDateRange(ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 根据商品名称搜索商品列表 [管理端]
   */
  async getGoodsListBySearchAdmin() {
    const { ctx, service } = this
    ctx.validate({
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
      search: 'string',
    }, ctx.query)
    const res = await service.goods.getGoodsListBySearchAdmin(ctx.query)
    ctx.reply(res)
  }

  /* GET
   * 根据学校或分类获取商品列表 [管理端]
   */
  async getGoodsListBySchoolOrCategoryAdmin() {
    const { ctx, service } = this
    ctx.validate({
      school_id: 'string?',
      category: 'string?',
      page: { type: 'int', min: 1 },
      page_size: { type: 'int', min: 1 },
    }, ctx.query)
    const res = await service.goods.getGoodsListBySchoolOrCategoryAdmin(ctx.query)
    ctx.reply(res)
  }
}

module.exports = GoodsController
