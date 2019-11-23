'use strict'

const Service = require('egg').Service

class NoticeService extends Service {
  getNoticeList() {
    // const res = this.ctx.model.Notice
    //   .find({}, '_id name')
    //   .then(school_list => {
    //     return { code: 2000, msg: '获取学校列表', data: { school_list } }
    //   })
    const res = {
      code: 2000,
      data: {
        notice_list: [
          {
            title: '优惠券即将到期', content: '您有一张八折优惠券即将到期，请及时使用您有一张八折优惠券即将到期，请及时使用您有一张八折优惠券即将到期，请及时使用您有一张八折优惠券即将到期，请及时使用', type: 0, time: 1569600000,
          },
          {
            title: '您关注的商品降价了', content: '您浏览过的商品 - 热水壶降价了，赶快来联系卖家吧', type: 1, time: 1561910400,
          },
          {
            title: '你有一个订单尚未付款', content: '如果到明天还没有付款，则订单将自动取消', type: 2, time: 1549600000,
          },
          {
            title: '系统崩溃了', content: '发生了未知错误，导致了系统崩溃，请刷新网页重试一下', type: 3, time: 1506700800,
          },
        ],
      },
    }
    return res
  }
}

module.exports = NoticeService
