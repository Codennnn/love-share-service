'use strict'

const Service = require('egg').Service

class AddressService extends Service {
  getAddressList(_id) {
    return this.ctx.model.User
      .findOne({ _id }, 'default_address address_list')
      .then(({ default_address, address_list }) => {
        return {
          code: 2000,
          msg: '获取收货地址',
          data: { default_address, address_list },
        }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  addAddress(_id, data) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $push: { address_list: data } },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功添加一个地址' }
        }
        return { code: 3000, msg: '没有添加任何地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  deleteAddress(_id, { address_id }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { $pull: { address_list: { _id: address_id } } }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功删除一个地址' }
        }
        return { code: 3000, msg: '没有删除任何地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  updateAddress(
    _id,
    { _id: address_id, receiver, phone, address, type }
  ) {
    return this.ctx.model.User
      .updateOne(
        { _id, 'address_list._id': address_id },
        {
          $set: {
            'address_list.$.receiver': receiver,
            'address_list.$.phone': phone,
            'address_list.$.address': address,
            'address_list.$.type': type,
          },
        },
        { runValidators: true } // 开启更新验证器
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功修改一个地址' }
        }
        return { code: 3000, msg: '没有修改地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }

  setDefaultAddress(_id, { address_id }) {
    return this.ctx.model.User
      .updateOne(
        { _id },
        { default_address: address_id },
        { runValidators: true }
      )
      .then(({ nModified }) => {
        if (nModified === 1) {
          return { code: 2000, msg: '成功设置默认地址' }
        }
        return { code: 3000, msg: '没有设置默认地址' }
      })
      .catch(err => {
        return { code: 5000, msg: err.message }
      })
  }
}

module.exports = AddressService
