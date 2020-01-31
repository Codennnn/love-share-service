'use strict'

module.exports = app => {
  require('./router/user')(app)
  require('./router/admin')(app)
  require('./router/io')(app)
}
