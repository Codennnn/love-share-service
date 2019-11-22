'use strict'

const Service = require('egg').Service
const fs = require('mz/fs')
const path = require('path')

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
