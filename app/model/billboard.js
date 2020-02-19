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
    type: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    link: String,
  }, { timestamps })

  return mongoose.model('Billboard', BillboardSchema)
}
