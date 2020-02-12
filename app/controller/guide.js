'use strict'

const Controller = require('egg').Controller

class GuideController extends Controller {
  /* GET
   * 获取帮助指引
   */
  async getGuideList() {
    const { ctx, service } = this
    const res = await service.guide.getGuideList()
    ctx.reply(res)
  }

  /* POST
   * 创建指引
   */
  async createGuide() {
    const { ctx, service } = this
    ctx.validate({
      section: 'string',
      articles: 'array?',
    })
    const res = await service.guide.createGuide(ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除指引
   */
  async deleteGuide() {
    const { ctx, service } = this
    ctx.validate({ section_id: 'string' })
    const res = await service.guide.deleteGuide(ctx.request.body)
    ctx.reply(res)
  }

  /* GET
   * 获取文章
   */
  async getArticle() {
    const { ctx, service } = this
    ctx.validate({
      section_id: 'string',
      article_id: 'string',
    }, ctx.query)
    const res = await service.guide.getArticle(ctx.query)
    ctx.reply(res)
  }

  /* POST
   * 添加文章
   */
  async addArticle() {
    const { ctx, service } = this
    ctx.validate({
      section_id: 'string',
      title: { type: 'string', maxlength: 15 },
      content: 'string?',
    })
    const res = await service.guide.addArticle(ctx.request.body)
    ctx.reply(res)
  }

  /* PUT
   * 添加文章
   */
  async updateArticle() {
    const { ctx, service } = this
    ctx.validate({
      _id: 'string',
      title: { type: 'string', maxlength: 15 },
      content: 'string',
    })
    const res = await service.guide.updateArticle(ctx.request.body)
    ctx.reply(res)
  }

  /* DELETE
   * 删除文章文章
   */
  async deleteArticle() {
    const { ctx, service } = this
    ctx.validate({ article_id: 'string' })
    const res = await service.guide.deleteArticle(ctx.request.body)
    ctx.reply(res)
  }
}

module.exports = GuideController
