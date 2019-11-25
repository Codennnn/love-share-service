'use strict'

module.exports = app => {
  const { router, controller, middleware } = app
  const { admin, user, goods, school, category, notice, common } = controller

  const auth1 = middleware.auth1() // 普通管理员权限
  const auth2 = middleware.auth2() // 超级管理员权限

  /*
   * 客户端
   */

  // 用户模块
  router.post('/api/user/sign_in', user.signIn)
  router.post('/api/user/sign_up', user.signUp)
  router.get('/api/user/info', user.getUserInfo)
  router.get('/api/user/info_num', user.getUserInfoNum)
  router.get('/api/user/detail', user.getUserDetail)
  router.put('/api/user/modify', user.modifyUser)
  router.put('/api/user/replace_avatar', user.replaceAvatar)
  router.get('/api/user/address_list', user.getAddressList)
  router.post('/api/user/address/add', user.addAddress)
  router.delete('/api/user/address/delete', user.deleteAddress)
  router.put('/api/user/address/update', user.updateAddress)
  router.put('/api/user/address/default', user.setDefaultAddress)
  router.post('/api/user/subscribe', user.subscribe)
  router.post('/api/user/unsubscribe', user.unsubscribe)
  router.put('/api/user/reset_password', user.resetPassword)
  // 商品模块
  router.post('/api/goods/img/upload', goods.uploadImg)
  router.delete('/api/goods/img/delete', goods.deleteImg)
  // 学校模块
  router.get('/api/school/list', school.getSchoolList)
  // 通知模块
  router.get('/api/notice/list', notice.getNoticeList)
  // 公共模块
  router.post('/api/common/check_phone_number', common.checkPhoneNumber)
  router.post('/api/common/verification_code', common.getVerificationCode)
  router.get('/api/category/list', category.getCategoryList)

  /*
   * 管理端
   */

  // 管理员模块
  router.post('/api/admin/login', admin.login)
  router.post('/api/admin/create', admin.createAdmin)
  // 用户模块
  router.get('/api/user/list', auth1, user.getUserList)
  router.put('/api/user/update', auth1, auth2, user.updateUser)
  router.delete('/api/user/delete', auth1, auth2, user.deleteUser)
  // 商品模块
  router.get('/api/goods/list', auth1, goods.getGoodsList)
  // 商品分类
  router.post('/api/category/add', auth1, category.addCategory)
  router.delete('/api/category/delete', auth1, category.deleteCategory)
  // 学校模块
  router.post('/api/school/add', auth1, auth2, school.addSchool)
  router.delete('/api/school/delete', auth1, auth2, school.deleteSchool)
  router.put('/api/school/update', auth1, auth2, school.updateSchool)
}
