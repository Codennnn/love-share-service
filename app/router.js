'use strict'

module.exports = app => {
  const { router, controller, middleware } = app
  const { admin, user, goods, school, common } = controller
  const permission = middleware.permission({
    superUrl: [
      '/api/user/update',
      '/api/user/delete',
    ],
  })

  /*
   * 客户端
   */

  // 用户模块
  router.post('/api/user/sign_in', user.signIn)
  router.post('/api/user/sign_up', user.signUp)
  router.get('/api/user/info', user.getUserInfo)
  router.get('/api/user/detail', user.getUserDetail)
  router.get('/api/user/address_list', user.getAddressList)
  router.post('/api/user/address/add', user.addAddress)
  router.delete('/api/user/address/delete', user.deleteAddress)
  router.put('/api/user/address/update', user.updateAddress)
  router.put('/api/user/address/default', user.setDefaultAddress)
  router.post('/api/user/subscribe', user.subscribe)
  router.post('/api/user/unsubscribe', user.unsubscribe)
  router.post('/api/user/reset_password', user.resetPassword)
  // 商品模块
  // 学校模块
  router.get('/api/school/list', school.getSchoolList)


  // 公共模块
  router.post('/api/common/check_phone_number', common.checkPhoneNumber)
  router.post('/api/common/verification_code', common.getVerificationCode)

  /*
   * 管理端
   */

  // 管理员模块
  router.post('/api/admin/login', admin.login)
  router.post('/api/admin/create', admin.createAdmin)
  // 用户模块
  router.get('/api/user/list', permission, user.getUserList)
  router.put('/api/user/update', permission, user.updateUser)
  router.delete('/api/user/delete', permission, user.deleteUser)
  // 商品模块
  router.get('/api/goods/list', permission, goods.getGoodsList)
  // 学校模块
  router.post('/api/school/add', permission, school.addSchool)
  router.delete('/api/school/delete', permission, school.deleteSchool)
}
