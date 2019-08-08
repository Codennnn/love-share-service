'use strict';

module.exports = app => {
  const { router, controller } = app;
  const { user } = controller;

  /*
   * 用户模块
   */
  router.post('/api/users/login', user.login);
  router.post('/api/users/register', user.register);
  router.get('/api/users/all', user.index);
  router.put('/api/users/update', user.update);
  router.delete('/api/users/destroy', user.destroy);
};
