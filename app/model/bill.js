'use strict'

module.exports = ({ mongoose, timestamps }) => {
  const Schema = mongoose.Schema

  const BillSchema = new Schema({
    amount: { type: Number, min: 0 },
    payment: { type: Number, required: true },
    type: { type: Number, required: true },
    status: { type: Number },
  }, { timestamps })

  return mongoose.model('Bill', BillSchema)
}
