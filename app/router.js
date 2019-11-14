'use strict'

module.exports = app => {
  const { router, controller, middleware } = app
  const { admin, user } = controller
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
  router.post('/api/user/login', user.login)
  router.post('/api/user/register', user.createUser)
  router.get('/api/user/info', user.getUserInfo)
  router.get('/api/user/address_list', user.getAddressList)
  router.post('/api/user/address/add', user.addAddress)
  router.delete('/api/user/address/delete', user.deleteAddress)
  router.put('/api/user/address/update', user.updateAddress)
  router.put('/api/user/address/default', user.setDefaultAddress)
  router.post('/api/user/subscribe', user.subscribe)
  router.post('/api/user/unsubscribe', user.unsubscribe)


  /*
   * 管理端
   */

  // 管理员模块
  router.post('/api/admin/login', admin.login)
  router.post('/api/admin/create', admin.create)
  // 用户模块
  router.get('/api/user/list', permission, user.getUserList)
  router.put('/api/user/update', permission, user.updateUser)
  router.delete('/api/user/delete', permission, user.deleteUser)
}
