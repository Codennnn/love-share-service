'use strict'

const path = require('path')
const sendToWormhole = require('stream-wormhole')
const Service = require('egg').Service

class GoodsService extends Service {
  async createGoods(_id, data) {
    const { ctx } = this
    data.seller = _id
    const goods = new ctx.model.Goods(data)
    try {
      const { _id } = await goods.save()
      await ctx.model.User.updateOne(
        { _id },
        {
          $push: {
            published_goods: { $each: [_id], $position: 0 },
          },
        }
      )
      return { code: 2000, msg: '成功创建商品' }
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  async deleteGoods(_id) {
    const { ctx } = this
    try {
      const { img_list } = await ctx.model.Goods.findOne({ _id })

      if (img_list) {
        const { code } = await this.deleteImg(img_list)
        if (code === 2000) {
          const { deletedCount } = await ctx.model.Goods.deleteOne({ _id })
          if (deletedCount === 1) {
            return { code: 2000, msg: '删除商品成功' }
          }
          return { code: 3000, msg: '无任何商品被删除' }
        }
      }
      throw new Error('删除商品的过程中删除图片失败')
    } catch (err) {
      return { code: 5000, msg: err.message }
    }
  }

  updateGoods(data) {
    return this.ctx.model.Goods
      .updateOne({ _id: data.goods_id }, data)
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功更新商品信息' }
        }
        return { code: 2000, msg: '没有更新任何商品' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateManyGoods(data) {
    return this.ctx.model.Goods
      .updateMany(
        { _id: { $in: data.goods_id_list } },
        data
      )
      .then(({ nModified }) => {
        if (nModified === data.goods_id_list.length) {
          return { code: 2000, msg: '全部商品的状态已更新' }
        }
        return { code: 3000, msg: '部分商品的状态更新失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async editGoods(_id, data) {
    data.seller = _id
    return this.ctx.model.Goods
      .updateOne({ _id: data._id, status: { $in: [1, 3] } }, data)
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功编辑商品信息' }
        }
        return { code: 3000, msg: '没有可以编辑的商品信息' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async getRecommendGoodsList(_id, { page, page_size: pageSize }) {
    const [total, goods_list] = await Promise.all([
      this.ctx.model.Goods.countDocuments({}),
      this.ctx.model.Goods
        .find({ status: 1 }, 'img_list name price')
        .sort({ created_at: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
    ])
    const pagination = {
      page,
      pageSize,
      total,
    }
    return { code: 2000, msg: '查询推荐商品列表', data: { goods_list, pagination } }
  }

  async getGoodsListByCategory({ page, page_size: pageSize, category }) {
    const { ctx, app } = this
    const goods_list = await ctx.model.Goods.aggregate([
      {
        $match: {
          category: { $in: [app.mongoose.Types.ObjectId(category)] },
          status: 1,
        },
      },
      { $project: { name: 1, price: 1, img_list: 1, created_at: 1 } },
      { $sort: { created_at: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ])
    const pagination = {
      page,
      pageSize,
      total: goods_list.length,
    }
    return { code: 2000, msg: '获取某分类的商品列表', data: { goods_list, pagination } }
  }

  async getGoodsListOfSameSchool({ school_id, page, page_size: pageSize, category = null }) {
    const { ctx, app } = this
    let goods_list
    let pagination

    if (!category) {
      goods_list = await ctx.model.Goods.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'seller',
            foreignField: '_id',
            as: 'seller',
          },
        },
        {
          $match: {
            'seller.school': app.mongoose.Types.ObjectId(school_id),
            status: 1,
          },
        },
        { $project: { name: 1, price: 1, img_list: 1, created_at: 1 } },
        { $sort: { created_at: -1 } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ])
      pagination = {
        page,
        pageSize,
        total: goods_list.length,
      }
      return { code: 2000, msg: '查询同校商品列表', data: { goods_list, pagination } }
    }

    const categories = category.map(el => app.mongoose.Types.ObjectId(el))
    goods_list = await ctx.model.Goods.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'seller',
        },
      },
      {
        $match: {
          category: { $in: categories },
          'seller.school': app.mongoose.Types.ObjectId(school_id),
          status: 1,
        },
      },
      { $project: { name: 1, price: 1, img_list: 1, created_at: 1 } },
      { $sort: { created_at: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ])
    pagination = {
      page,
      pageSize,
      total: goods_list.length,
    }
    return { code: 2000, msg: '根据分类查询同校商品列表', data: { goods_list, pagination } }
  }

  async getGoodsList({ page, page_size: pageSize }) {
    const [total, goods_list] = await Promise.all([
      this.ctx.model.Goods.estimatedDocumentCount(),
      this.ctx.model.Goods
        .find({}, 'name category created_at')
        .skip((page - 1) * pageSize)
        .limit(pageSize),
    ])
    const pagination = {
      page,
      pageSize,
      total,
    }
    return { code: 2000, msg: '查询商品列表', data: { goods_list, pagination } }
  }

  getGoodsDetail(_id) {
    return this.ctx.model.Goods
      .findOne({ _id }, '-comments')
      .populate('category', '-_id name')
      .then(goods_detail => {
        return { code: 2000, msg: '查询商品详情', data: { goods_detail } }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  async uploadImg(id, parts) {
    const { app } = this
    let part
    const result = []
    const imgList = []
    while ((part = await parts()) != null) {
      if (part.length) {
        //
      } else {
        if (!part.filename) {
          return { code: 5000, msg: '图片上传失败' }
        }
        try {
          const res = await app.fullQiniu.uploadStream(
            `${id}-${path.basename(part.filename)}`,
            part
          )
          if (res.ok) {
            imgList.push(res.url)
            result.push(true)
          } else {
            result.push(false)
          }
        } catch {
          // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
          await sendToWormhole(part)
          result.push(false)
        }
      }
    }

    if (result.every(Boolean)) {
      return { code: 2000, data: { img_list: imgList }, msg: '所有图片上传成功' }
    } else if (result.some(Boolean)) {
      return { code: 5000, msg: '部分图片上传失败' }
    }
    return { code: 5000, msg: '图片上传失败' }
  }

  async deleteImg(imgList) {
    const { app } = this
    const files = imgList.map(el => {
      return path.basename(el)
    })
    const { ok, list } = await app.fullQiniu.batchDelete(files)

    if (ok) {
      if (list.every(li => li.code === 200)) {
        return { code: 2000, msg: '所有图片删除成功' }
      }
      return { code: 5001, msg: '部分图片删除失败' }
    }
    return { code: 5000, msg: '所有图片删除失败' }
  }

  async getGoodsSeller(_id) {
    const { app, ctx } = this
    const { seller } = await ctx.model.Goods
      .findOne({ _id }, 'seller')
      .populate({
        path: 'seller',
        select: 'avatar_url nickname school gender credit_value',
        populate: { path: 'school', select: '-_id name' },
      })
    const [published_num, [{ fans_num }]] = await Promise.all([
      ctx.model.Goods.countDocuments({ seller: seller._id }),
      ctx.model.User.aggregate([
        { $match: { _id: app.mongoose.Types.ObjectId(seller._id) } },
        {
          $project: {
            _id: 0,
            fans_num: { $size: '$fans' },
          },
        },
      ]),
    ])
    Object.assign(seller._doc, { published_num, fans_num })
    return { code: 2000, msg: '获取商品卖家信息', data: { seller } }
  }

  async getGoodsComments({ goods_id: _id, page, page_size }) {
    const { ctx, app } = this
    const [{ comments }, [{ total }]] = await Promise.all([
      ctx.model.Goods
        .findOne({ _id }, { comments: { $slice: [(page - 1) * page_size, page_size] } })
        .populate({
          path: 'comments.sender',
          select: 'avatar_url nickname',
        })
        .populate({
          path: 'comments.replies.sender',
          select: 'nickname',
        })
        .populate({
          path: 'comments.replies.at',
          select: 'nickname',
        }),
      ctx.model.Goods.aggregate([
        { $match: { _id: app.mongoose.Types.ObjectId(_id) } },
        {
          $project: {
            _id: 0,
            total: { $size: '$comments' },
          },
        },
      ]),
    ])
    return {
      code: 2000,
      msg: '获取商品留言',
      data: {
        comments,
        pagination: {
          total, page, page_size,
        },
      },
    }
  }

  postComment(_id, { goods_id, content }) {
    return this.ctx.model.Goods
      .updateOne(
        { _id: goods_id },
        { $push: { comments: { $each: [{ content, sender: _id }], $position: 0 } } },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '已成功发送一条留言' }
        }
        return { code: 3000, msg: '留言失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  replyComment(_id, { goods_id, comment_id, at, content }) {
    return this.ctx.model.Goods
      .updateOne(
        { _id: goods_id, 'comments._id': comment_id },
        {
          $push: { 'comments.$.replies': { sender: _id, at, content } },
        },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '已成功回复一条留言' }
        }
        return { code: 3000, msg: '回复留言失败' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  isGoodsCollected(_id, { goods_id }) {
    return this.ctx.model.User
      .findOne({ _id }, 'collections')
      .then(({ collections }) => {
        const is_collected = collections.some(el => String(el.goods) === goods_id)
        return { code: 2000, msg: '是否收藏了该商品', data: { is_collected } }
      })
  }

  async getGoodsListInfo() {
    const [on_sell_count, off_sell_count] = await Promise.all([
      this.ctx.model.Goods.countDocuments({ status: 1 }),
      this.ctx.model.Goods.countDocuments({ status: 3 }),
    ])
    return { code: 2000, data: { on_sell_count, off_sell_count } }
  }

  async getGoodsListByStatus(status, { page, page_size: pageSize }) {
    const [total, goods_list] = await Promise.all([
      this.ctx.model.Goods.estimatedDocumentCount(),
      this.ctx.model.Goods
        .find({ status }, 'name category seller price collect_num created_at')
        .populate('seller', 'avatar_url real_name nickname')
        .populate('category', 'name')
        .skip((page - 1) * pageSize)
        .limit(pageSize),
    ])
    const pagination = {
      page,
      pageSize,
      total,
    }
    return { code: 2000, msg: '查询商品列表', data: { goods_list, pagination } }
  }
}

module.exports = GoodsService
