const { Schema, model, options } = require('./config')

const userSchema = new Schema({
  createdAt: { type:String, select: false },
  updatedAt: { type:String, select: false },
  username: { type:String, required: true },
  password: { type:String, required: true, select: false },
  email: { type:String, required: true },
  avatar_url: { type: String, default: '' }, // 头像url地址
}, options);

module.exports = model('User', userSchema);