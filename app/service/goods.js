'use strict'

const fs = require('mz/fs')
const path = require('path')
const Service = require('egg').Service

class GoodsService extends Service {
  async getGoodsList(data) {
    const page = Number(data.page)
    const pageSize = Number(data.pageSize)
    const [ total, goods_list ] = await Promise.all([
      this.ctx.model.Goods.find().count(),
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

  async getCartList() {
    const cart_list = [
      {
        goods_id: () => '123456',
        img_list: [ 'https://cdn-demo.algolia.com/bestbuy-0118/4397400_sb.jpg' ],
        'goods_num|1-4': 1,
        name: '富婆快乐球',
        nickname: '令狐少侠',
        real_name: '陈梓聪',
        'quantity|1-2': 1,
        amount: 1,
        'delivery|1-3': 1,
        'delivery_charge|0-5': 0,
        price: '29.90',
        'collect_num|1-10': 4,
        'is_collected|1-2': true,
        time: '2019-10-21',
      },
    ]
    return { code: 2000, msg: '获取购物车列表', data: { cart_list } }
  }

  async uploadImg(id, files) {
    const { app } = this
    const res = await Promise.all(files.map(async file => {
      try {
        return await app.fullQiniu.uploadFile(
          `${id}-${path.basename(file.filename)}`,
          file.filepath
        )
      } finally {
        // 需要删除临时文件
        await fs.unlink(file.filepath)
      }
    }))
    if (res.every(el => el.ok)) {
      return { code: 2000, msg: '所有图片上传成功' }
    } else if (res.some(el => el.ok)) {
      return { code: 5001, msg: '部分图片上传失败' }
    }
    return { code: 5000, msg: '图片上传失败' }
  }

  async deleteImg(imgList) {
    const { app } = this
    const res = await Promise.all(
      imgList.map(
        async imgName => await app.fullQiniu.delete(path.basename(imgName))
      )
    )
    if (res.every(el => el.ok)) {
      return { code: 2000, msg: '所有图片删除成功' }
    } else if (res.some(el => el.ok)) {
      return { code: 5001, msg: '部分图片删除失败' }
    }
    return { code: 5000, msg: '所有图片删除失败' }
  }
}

module.exports = GoodsService
