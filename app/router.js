'use strict'

module.exports = app => {
  const { router, controller, middleware, io } = app
  const {
    admin, user, goods, order, address, school, category,
    notice, chat, cart, begging, guide, billboard, todo, common,
  } = controller
  const { get, post, put, delete: dele } = router
  const { auth } = middleware

  /* ===========================
   * ========== 客户端 ==========
   * ===========================
   */

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
  get('/api/user/purchased_goods', user.getPurchasedGoods)

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
  get('/api/goods/list/by_category', goods.getGoodsListByCategory)
  post('/api/goods/list/same_school', goods.getGoodsListOfSameSchool)
  post('/api/goods/img/upload', goods.uploadImg)
  dele('/api/goods/img/delete', goods.deleteImg)
  put('/api/goods/update_many', goods.updateManyGoods)
  get('/api/goods/seller', goods.getGoodsSeller)

  get('/api/goods/comments', goods.getGoodsComments)
  post('/api/goods/comment/post', goods.postComment)
  post('/api/goods/comment/reply', goods.replyComment)

  post('/api/goods/is_collected', goods.isGoodsCollected)

  // 求购模块
  get('/api/begging/list', begging.getBeggingList)
  post('/api/begging', begging.addBegging)

  // 订单模块
  post('/api/order/create', order.createOrder)
  dele('/api/order/delete', order.deleteOrder)
  get('/api/order/detail', order.geteOrderDetail)
  get('/api/order/by_user', order.geteOrdersByUser)

  // 学校模块
  get('/api/school/list', school.getSchoolList)

  // 公共模块
  post('/api/common/check_nickname', common.checkNickname)
  post('/api/common/check_phone_number', common.checkPhoneNumber)
  post('/api/common/verification_code', common.getVerificationCode)
  get('/api/category/list', category.getCategoryList)

  /* ===========================
   * ========== 管理端 ==========
   * ===========================
   */

  // 管理员模块
  post(
    '/api/admin/create',
    auth('admin', ['write', 'create']),
    admin.createAdmin)
  put(
    '/api/admin/update',
    auth('admin', ['write']),
    admin.updateAdmin)
  post(
    '/api/admin/sign_in',
    admin.signIn)
  get(
    '/api/admin/info',
    auth('admin', ['read']),
    admin.getAdminInfo)
  get(
    '/api/admin/detail',
    auth('admin', ['read']),
    admin.getAdminDetail)
  get(
    '/api/admin/list',
    auth('admin', ['read']),
    admin.getAdminList)
  put(
    '/api/admin/bind_user',
    auth('admin', ['write']),
    admin.bindUser)
  put(
    '/api/admin/unbind_user',
    auth('admin', ['write']),
    admin.unbindUser)
  post(
    '/api/admin/upload_avatar',
    auth('admin', ['write']),
    admin.uploadAvatar)
  put(
    '/api/admin/replace_avatar',
    auth('admin', ['write']),
    admin.replaceAvatar)
  get(
    '/api/admin/todo/list',
    todo.getTodoList)
  post(
    '/api/admin/todo/add',
    todo.addTodo)
  dele(
    '/api/admin/todo/delete',
    todo.deleteTodo)
  put(
    '/api/admin/todo/update',
    todo.updateTodo)
  put(
    '/api/admin/todo/update_type',
    todo.updateTodoType)
  get(
    '/api/admin/sign_log',
    admin.getSignLog)

  // 通知模块
  get('/api/admin/notice/list', notice.getNoticeListByAdmin)
  get(
    '/api/admin/notice/unread',
    notice.getUnreadNoticesByAdmin)
  post('/api/admin/notice/add', notice.addNoticeByAdmin)
  dele('/api/admin/notice/delete', notice.deleteNoticeByAdmin)
  dele('/api/admin/notice/delete_many', notice.deleteManyNoticesByAdmin)
  put('/api/admin/notice/set_read', notice.setNoticeReadByAdmin)
  put('/api/admin/notice/set_all_read', notice.setAllNoticesReadByAdmin)

  // 聊天模块
  post('/api/admin/chat/contact/add', chat.addContactByAdmin)
  dele('/api/admin/chat/contact/delete', chat.deleteContactByAdmin)
  get('/api/admin/chat/contact/list', chat.getContactListByAdmin)
  get('/api/admin/chat/contact_info', chat.getContactInfoByAdmin)
  get('/api/admin/chat/chat_data', chat.getChatDataByAdmin)

  // 用户模块
  get(
    '/api/user/list',
    auth('user', ['read']),
    user.getUserList)
  get(
    '/api/user/detail_by_admin',
    auth('user', ['read']),
    user.getUserDetailByAdmin)
  post(
    '/api/user/daily_statistics',
    auth('user', ['read']),
    user.getUserDailyStatistics)
  put(
    '/api/user/update',
    auth('user', ['write']),
    user.updateUser)
  dele(
    '/api/user/delete',
    auth('user', ['delete']),
    user.deleteUser)

  // 商品模块
  get(
    '/api/goods/list',
    auth('goods', ['read']),
    goods.getGoodsList)
  get(
    '/api/goods/list/info',
    auth('user', ['read']),
    goods.getGoodsListInfo)
  get(
    '/api/goods/list/on_sell',
    auth('user', ['read']),
    goods.getGoodsListOnSell)
  get(
    '/api/goods/list/off_sell',
    auth('user', ['read']),
    goods.getGoodsListOffSell)

  // 订单模块
  get(
    '/api/order/list',
    auth('order', ['read']),
    order.getOrderList)
  get(
    '/api/order/transaction',
    auth('order', ['read']),
    order.getOrderTransaction)
  get(
    '/api/order/volume',
    auth('order', ['read']),
    order.getOrderVolume)
  get(
    '/api/order/num',
    auth('order', ['read']),
    order.getOrderNum)

  // 资讯模块
  get(
    '/api/guide/list',
    auth('guide', ['read']),
    guide.getGuideList)
  post(
    '/api/guide/create',
    auth('guide', ['create']),
    guide.createGuide)
  dele(
    '/api/guide/delete',
    auth('guide', ['delete']),
    guide.deleteGuide)
  post(
    '/api/guide/article/add',
    auth('guide', ['create']),
    guide.addArticle)
  get(
    '/api/guide/article',
    auth('guide', ['read']),
    guide.getArticle)
  put(
    '/api/guide/article/update',
    auth('guide', ['write']),
    guide.updateArticle)
  dele(
    '/api/guide/article/delete',
    auth('guide', ['delete']),
    guide.deleteArticle)

  // 求购模块
  get(
    '/api/begging/list',
    auth('guide', ['delete']),
    begging.getBeggingList
  )
  post('/api/begging', begging.addBegging)

  // 广告牌模块
  get('/api/billboard/list', billboard.getBillboardList)
  post('/api/billboard/upload', billboard.uploadBillboard)
  dele('/api/billboard/delete', billboard.deleteBillboard)

  // 分类模块
  post(
    '/api/category/add',
    auth('goods', ['create']),
    category.addCategory)
  dele(
    '/api/category/delete',
    auth('goods', ['delete']),
    category.deleteCategory)

  // 学校模块
  post(
    '/api/school/add',
    auth('order', ['read']),
    school.addSchool)
  dele(
    '/api/school/delete',
    auth('order', ['delete']),
    school.deleteSchool)
  put(
    '/api/school/update',
    auth('order', ['write']),
    school.updateSchool)


  io.route('setOnline', io.controller.action.setOnline)
  io.route('sendMessage', io.controller.chat.sendMessage)
}
