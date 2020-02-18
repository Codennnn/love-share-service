'use strict'

module.exports = ({ mongoose, timestamps }) => {
  const Schema = mongoose.Schema

  const BillboardSchema = new Schema({
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  }, { timestamps })

  return mongoose.model('Billboard', BillboardSchema)
}
