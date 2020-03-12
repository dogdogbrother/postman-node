const { Schema, model, options } = require('./config')

/**
 * 接口的定义如下：
 * name：接口名称
 * describe: 接口描述
 * project：项目id
 * collectionId：集合id
 * founder：建立者
 * folder：所属文件夹
 * method：接口方法
 * content: 接口内的一些详细信息，调用地址啊，参数啊什么的
 */

const requestSchema = new Schema({
  createdAt: { type: String, select: false },
  updatedAt: { type: String, select: false },
  name: { type: String, require: true },
  describe: { type: String, default: '', require: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" , require: true },
  founder: { type: Schema.Types.ObjectId, ref: "User" , require: true },
  collectionId: { type: Schema.Types.ObjectId, ref: "Collection", require: true },
  folder: { type: Schema.Types.ObjectId, ref: "Folder" },
  method: { type: String, enum: ['get', 'post', 'delete', 'put', 'patch'], defaulet: 'get',  required: true },
  content: { type: Object }
}, options);

module.exports = model('Request', requestSchema);   