const { Schema, model, options } = require('./config')

//  集合内容，创建者founder，所属项目project，下面有多少个请求数量 requestTotal,描述describe

// requestTotal为啥要单独立一个字段呢，是因为集合里面有可能有文件夹，也有可能有请求，这个没必要有递归操作，就直接每次添加的时候+1，删除的时候-1就行了

const collectionSchema = new Schema({
  createdAt: { type: String, select: false },
  updatedAt: { type: String, select: false },
  name: { type: String, require: true },
  describe: { type: String, default: '', require: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" , require: true },
  founder: { type: Schema.Types.ObjectId, ref: "User" , require: true },
  requestTotal: { type: Number, defaulet: 0, require: true }
}, options);

module.exports = model('Collection', collectionSchema);   