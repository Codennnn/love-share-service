'use strict'

module.exports = ({ mongoose, timestamps }) => {
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
  }, { timestamps })

  return mongoose.model('Log', LogSchema)
}
