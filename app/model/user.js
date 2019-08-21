'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    user_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
    },
    nick_name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 8,
    },
    real_name: {
      type: String,
      requier: true,
      maxlength: 6,
    },
    roles: {
      type: Array,
      required: true,
    },
  });

  UserSchema.set('timestamps', {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return mongoose.model('User', UserSchema);
};
