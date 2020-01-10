'use strict'

module.exports = app => {
  const { router, controller, middleware, io } = app
  const {
    admin, user, goods, order, address, school, category,
    notice, chat, cart, begging, common,
  } = controller

  const auth1 = middleware.auth1() // 普通管理员权限
  const auth2 = middleware.auth2() // 超级管理员权限

  /*
   * 客户端
   */

  // 用户模块
  router.post('/api/user/sign_in', user.signIn)
  router.post('/api/user/sign_up', user.signUp)
  router.put('/api/user/reset_password', user.resetPassword)
  router.get('/api/user/info', user.getUserInfo)
  router.get('/api/user/other/info', user.getOtherUserInfo)
  router.get('/api/user/info_num', user.getUserInfoNum)
  router.get('/api/user/detail', user.getUserDetail)
  router.put('/api/user/modify', user.modifyUser)
  router.put('/api/user/replace_avatar', user.replaceAvatar)
  router.post('/api/user/is_followed', user.isUserFollowed)

  router.put('/api/user/credit_value', user.updateCreditValue)
  router.put('/api/user/share_value', user.updateShareValue)
  router.put('/api/user/beans', user.updateBean)

  router.get('/api/user/address_list', address.getAddressList)
  router.post('/api/user/address/add', address.addAddress)
  router.delete('/api/user/address/delete', address.deleteAddress)
  router.put('/api/user/address/update', address.updateAddress)
  router.put('/api/user/address/default', address.setDefaultAddress)

  router.post('/api/user/subscribe', user.subscribe)
  router.delete('/api/user/unsubscribe', user.unsubscribe)

  router.get('/api/user/published_goods', user.getPublishedGoods)
  router.get('/api/user/purchased_goods', user.getPurchasedGoods)

  router.get('/api/user/check_in_list', user.getCheckInList)
  router.post('/api/user/check_in', user.checkIn)

  router.get('/api/user/follows', user.getUserFollows)
  router.get('/api/user/fans', user.getUserFans)

  router.get('/api/user/collection/list', user.getCollectionList)
  router.post('/api/user/collection/add', user.addCollection)
  router.delete('/api/user/collection/delete', user.deleteCollection)

  // 聊天模块
  router.post('/api/chat/contact/add', chat.addContact)
  router.delete('/api/chat/contact/delete', chat.deleteContact)
  router.get('/api/chat/contact/list', chat.getContactList)
  router.get('/api/chat/contact_info', chat.getContactInfo)
  router.get('/api/chat/chat_data', chat.getChatData)

  // 购物车模块
  router.post('/api/cart/add', cart.addCartItem)
  router.delete('/api/cart/delete', cart.removeCartItem)
  router.delete('/api/cart/clear', cart.clearCartList)
  router.get('/api/cart/list', cart.getCartList)

  // 通知模块
  router.get('/api/notice/list', notice.getNoticeList)
  router.get('/api/notice/unread', notice.getUnreadNotices)
  router.post('/api/notice/add', notice.addNotice)
  router.delete('/api/notice/delete', notice.deleteNotice)
  router.delete('/api/notice/delete_many', notice.deleteManyNotices)
  router.put('/api/notice/set_read', notice.setNoticeRead)
  router.put('/api/notice/set_all_read', notice.setAllNoticesRead)

  // 商品模块
  router.post('/api/goods/create', goods.createGoods)
  router.delete('/api/goods/delete', goods.deleteGoods)
  router.put('/api/goods/edit', goods.editGoods)

  router.get('/api/goods/detail', goods.getGoodsDetail)
  router.get('/api/goods/list/recommend', goods.getRecommendGoodsList)
  router.get('/api/goods/list/by_category', goods.getGoodsListByCategory)
  router.post('/api/goods/list/same_school', goods.getGoodsListOfSameSchool)
  router.post('/api/goods/img/upload', goods.uploadImg)
  router.delete('/api/goods/img/delete', goods.deleteImg)
  router.put('/api/goods/update_many', goods.updateManyGoods)
  router.get('/api/goods/seller', goods.getGoodsSeller)

  router.get('/api/goods/comments', goods.getGoodsComments)
  router.post('/api/goods/comment/post', goods.postComment)
  router.post('/api/goods/comment/reply', goods.replyComment)

  router.post('/api/goods/is_collected', goods.isGoodsCollected)

  // 求购模块
  router.get('/api/begging/list', begging.getBeggingList)
  router.post('/api/begging', begging.addBegging)

  // 订单模块
  router.post('/api/order/create', order.createOrder)
  router.delete('/api/order/delete', order.deleteOrder)
  router.get('/api/order/detail', order.geteOrderDetail)
  router.get('/api/order/by_user', order.geteOrdersByUser)

  // 学校模块
  router.get('/api/school/list', school.getSchoolList)

  // 公共模块
  router.post('/api/common/check_nickname', common.checkNickname)
  router.post('/api/common/check_phone_number', common.checkPhoneNumber)
  router.post('/api/common/verification_code', common.getVerificationCode)
  router.get('/api/category/list', category.getCategoryList)

  /*
   * 管理端
   */

  // 管理员模块
  router.post('/api/admin/create', admin.createAdmin)
  router.post('/api/admin/sign_in', admin.signIn)
  router.get('/api/admin/info', admin.getAdminInfo)
  router.get('/api/admin/detail', admin.getAdminDetail)
  router.get('/api/admin/list', admin.getAdminList)
  router.put('/api/admin/replace_avatar', admin.replaceAvatar)

  // 用户模块
  router.get('/api/user/list', auth1, user.getUserList)
  router.put('/api/user/update', auth1, auth2, user.updateUser)
  router.delete('/api/user/delete', auth1, auth2, user.deleteUser)

  // 商品模块
  router.get('/api/goods/list', auth1, goods.getGoodsList)
  router.get('/api/goods/list/info', auth1, goods.getGoodsListInfo)
  router.get('/api/goods/list/on_sell', auth1, goods.getGoodsListOnSell)
  router.get('/api/goods/list/off_sell', auth1, goods.getGoodsListOffSell)

  router.post('/api/category/add', auth1, category.addCategory)
  router.delete('/api/category/delete', auth1, category.deleteCategory)

  // 订单模块
  router.get('/api/order/list', order.getOrderList)

  // 学校模块
  router.post('/api/school/add', auth1, auth2, school.addSchool)
  router.delete('/api/school/delete', auth1, auth2, school.deleteSchool)
  router.put('/api/school/update', auth1, auth2, school.updateSchool)


  io.route('setOnline', io.controller.action.setOnline)
  io.route('sendMessage', io.controller.chat.sendMessage)
}
