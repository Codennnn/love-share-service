'use strict'

const Service = require('egg').Service

class GuideService extends Service {
  getGuideList() {
    return this.ctx.model.Guide
      .find({})
      .sort({ created_at: -1 })
      .then(guide_list => {
        return { code: 2000, msg: '获取指引列表', data: { guide_list } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async createGuide(data) {
    const guide = new this.ctx.model.Guide(data)
    try {
      await guide.save()
      return { code: 2000, msg: '成功创建一个新的指引栏目' }
    } catch (err) {
      if (err.message.includes('duplicate key error')) {
        if (err.message.includes('section')) {
          return { code: 4002, msg: '栏目名称已存在' }
        }
      }
      return { code: 5000, msg: err.message }
    }
  }

  deleteGuide({ section_id: _id }) {
    return this.ctx.model.Guide
      .deleteOne({ _id })
      .then(({ deletedCount }) => {
        if (deletedCount === 1) {
          return { code: 2000, msg: '删除了一个栏目' }
        }
        return { code: 3000, msg: '无任何分类被删除' }
      })
  }

  getArticle({ section_id: _id, article_id }) {
    return this.ctx.model.Guide
      .findOne({ _id }, 'articles')
      .then(({ articles }) => {
        const [article] = articles.filter(el => String(el._id) === article_id
        )
        return { code: 2000, msg: '获取文章内容', data: { article } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  addArticle({ section_id: _id, title, content = '' }) {
    return this.ctx.model.Guide
      .updateOne(
        { _id },
        { $push: { articles: { title, content } } }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功添加一篇文章' }
        }
        return { code: 3000, msg: '没有添加任何文章' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateArticle({ _id, title, content = '' }) {
    return this.ctx.model.Guide
      .updateOne(
        { 'articles._id': _id },
        {
          $set: {
            'articles.$.title': title,
            'articles.$.content': content,
          },
        }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功修改一篇文章' }
        }
        return { code: 3000, msg: '没有修改任何文章' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  deleteArticle({ article_id: _id }) {
    return this.ctx.model.Guide
      .updateOne(
        { 'articles._id': _id },
        { $pull: { articles: { _id } } }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除一篇文章' }
        }
        return { code: 3000, msg: '没有删除任何文章' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = GuideService
