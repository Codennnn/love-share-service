'use strict'

const Controller = require('egg').Controller

class GuideController extends Controller {
  /* POST
   * 创建指引
   */
  async createGuide() {
    const { ctx, service } = this
    try {
      ctx.validate({
        section: 'string',
        articles: 'array?',
      })
      const res = await service.guide.createGuide(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取帮助指引
   */
  async getGuideList() {
    const { ctx, service } = this
    try {
      const res = await service.guide.getGuideList()
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* GET
   * 获取文章
   */
  async getArticle() {
    const { ctx, service } = this
    try {
      ctx.validate({
        section_id: 'string',
        article_id: 'string',
      }, ctx.request.query)
      const res = await service.guide.getArticle(ctx.request.query)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* POST
   * 添加文章
   */
  async addArticle() {
    const { ctx, service } = this
    try {
      ctx.validate({
        section_id: 'string',
        title: { type: 'string', maxlength: 15 },
        content: 'string?',
      })
      const res = await service.guide.addArticle(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* PUT
   * 添加文章
   */
  async updateArticle() {
    const { ctx, service } = this
    try {
      ctx.validate({
        _id: 'string',
        title: { type: 'string', maxlength: 15 },
        content: 'string',
      })
      const res = await service.guide.updateArticle(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }

  /* DELETE
   * 删除文章文章
   */
  async deleteArticle() {
    const { ctx, service } = this
    try {
      ctx.validate({ article_id: 'string' })
      const res = await service.guide.deleteArticle(ctx.request.body)
      ctx.reply(res)
    } catch (err) {
      ctx.reply(err, 400)
    }
  }
}

module.exports = GuideController
