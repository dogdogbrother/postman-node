const { Schema, model, options } = require('./config')

//  信息内容，发起人，接受者，是否读了

const infoSchema = new Schema({
  createdAt: { type: String, select: false },
  updatedAt: { type: String, select: false },
  title: { type: String, require: true },
  msg: { type: String, require: true },
  founder: { type: Schema.Types.ObjectId, ref: "User" , require: true },
  addressee: { type: Schema.Types.ObjectId, ref: "User" , require: true, select: false },
  isRead: { type: Boolean, defaulet: false, require: true }
}, options);

module.exports = model('Info', infoSchema);   