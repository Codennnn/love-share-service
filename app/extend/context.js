'use strict'

module.exports = {
  reply(res, status = 200) {
    this.body = res
    this.status = status
  },
}
