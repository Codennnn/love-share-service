'use strict'

module.exports = app => {
  require('./router/user')(app)
  require('./router/admin')(app)
  require('./router/socket')(app)
}
