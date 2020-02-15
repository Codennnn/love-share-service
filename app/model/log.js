'use strict'

module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const LogSchema = new Schema({
    err: {
      type: Object,
      required: true,
    },
    detail: {
      type: Object,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
  })

  LogSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  })

  return mongoose.model('Log', LogSchema)
}
