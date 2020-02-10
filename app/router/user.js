'use strict'

module.exports = app => {
  const { router, controller } = app
  const { get, post, put, delete: dele } = router
  const {
    user, goods, order, address, school, category,
    notice, chat, cart, begging, common,
  } = controller

  // 用户模块
  post('/api/user/sign_in', user.signIn)
  post('/api/user/sign_up', user.signUp)
  put('/api/user/reset_password', user.resetPassword)
  get('/api/user/info', user.getUserInfo)
  get('/api/user/other/info', user.getOtherUserInfo)
  get('/api/user/info_num', user.getUserInfoNum)
  get('/api/user/detail', user.getUserDetail)
  put('/api/user/modify', user.modifyUser)
  put('/api/user/replace_avatar', user.replaceAvatar)
  post('/api/user/is_followed', user.isUserFollowed)

  put('/api/user/credit_value', user.updateCreditValue)
  put('/api/user/share_value', user.updateShareValue)
  put('/api/user/beans', user.updateBean)

  get('/api/user/address_list', address.getAddressList)
  post('/api/user/address/add', address.addAddress)
  dele('/api/user/address/delete', address.deleteAddress)
  put('/api/user/address/update', address.updateAddress)
  put('/api/user/address/default', address.setDefaultAddress)

  post('/api/user/subscribe', user.subscribe)
  dele('/api/user/unsubscribe', user.unsubscribe)

  get('/api/user/published_goods', user.getPublishedGoods)
  get('/api/user/bought_goods', user.getBoughtGoods)

  get('/api/user/check_in_list', user.getCheckInList)
  post('/api/user/check_in', user.checkIn)

  get('/api/user/follows', user.getUserFollows)
  get('/api/user/fans', user.getUserFans)

  get('/api/user/collection/list', user.getCollectionList)
  post('/api/user/collection/add', user.addCollection)
  dele('/api/user/collection/delete', user.deleteCollection)

  // 聊天模块
  post('/api/chat/contact/add', chat.addContact)
  dele('/api/chat/contact/delete', chat.deleteContact)
  get('/api/chat/contact/list', chat.getContactList)
  get('/api/chat/contact_info', chat.getContactInfo)
  get('/api/chat/chat_data', chat.getChatData)

  // 购物车模块
  post('/api/cart/add', cart.addCartItem)
  dele('/api/cart/delete', cart.removeCartItem)
  dele('/api/cart/clear', cart.clearCartList)
  get('/api/cart/list', cart.getCartList)

  // 通知模块
  get('/api/notice/list', notice.getNoticeList)
  get('/api/notice/unread', notice.getUnreadNotices)
  post('/api/notice/add', notice.addNotice)
  dele('/api/notice/delete', notice.deleteNotice)
  dele('/api/notice/delete_many', notice.deleteManyNotices)
  put('/api/notice/set_read', notice.setNoticeRead)
  put('/api/notice/set_all_read', notice.setAllNoticesRead)

  // 商品模块
  post('/api/goods/create', goods.createGoods)
  dele('/api/goods/delete', goods.deleteGoods)
  put('/api/goods/edit', goods.editGoods)

  get('/api/goods/detail', goods.getGoodsDetail)
  get('/api/goods/list/recommend', goods.getRecommendGoodsList)
  get('/api/goods/list/by_search', goods.getGoodsListBySearch)
  get('/api/goods/list/by_category', goods.getGoodsListByCategory)
  post('/api/goods/list/same_school', goods.getGoodsListOfSameSchool)
  post('/api/goods/img/upload', goods.uploadImg)
  dele('/api/goods/img/delete', goods.deleteImg)
  put('/api/goods/update_many', goods.updateManyGoods)
  get('/api/goods/seller', goods.getGoodsSeller)

  get('/api/goods/comments', goods.getGoodsComments)
  post('/api/goods/comment/post', goods.postComment)
  post('/api/goods/comment/reply', goods.replyComment)
  post('/api/goods/review/post', goods.postReview)

  post('/api/goods/is_collected', goods.isGoodsCollected)

  // 求购模块
  get('/api/begging/list', begging.getBeggingList)
  post('/api/begging', begging.addBegging)

  // 订单模块
  post('/api/order/create', order.createOrder)
  dele('/api/order/delete', order.deleteOrder)
  put('/api/order/completed', order.completedOrder)
  put('/api/order/cancel', order.cancelOrder)
  get('/api/order/detail', order.geteOrderDetail)
  get('/api/order/by_user', order.geteOrdersByUser)

  // 学校模块
  get('/api/school/list', school.getSchoolList)

  // 公共模块
  post('/api/common/check_nickname', common.checkNickname)
  post('/api/common/check_phone_number', common.checkPhoneNumber)
  post('/api/common/verification_code', common.getVerificationCode)
  get('/api/category/list', category.getCategoryList)
}
