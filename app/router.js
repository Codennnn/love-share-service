'use strict'

module.exports = app => {
  const { router, controller, middleware } = app
  const { admin, user } = controller
  const auth = middleware.permission({
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
  router.post('/api/user/register', user.register)
  router.get('/api/user/info', user.getUserInfo)
  router.get('/api/user/address_list', user.getAddressList)
  router.post('/api/user/address/add', user.addAddress)


  /*
   * 管理端
   */

  // 管理员模块
  router.post('/api/admin/login', admin.login)
  router.post('/api/admin/create', admin.create)
  // 用户模块
  router.get('/api/user/list', auth, user.getUserList)
  router.put('/api/user/update', auth, user.updateUser)
  router.delete('/api/user/delete', auth, user.delete)
}
