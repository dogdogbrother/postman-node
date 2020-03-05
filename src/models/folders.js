const { Schema, model, options } = require('./config')

//  集合下面的文件夹内容，创建者founder，所属项目project，所属集合collectionId, 文件夹的上级文件夹pId,文件夹名称name，文件夹描述describe


const folderSchema = new Schema({
  createdAt: { type: String, select: false },
  updatedAt: { type: String, select: false },
  name: { type: String, require: true },
  describe: { type: String, default: '', require: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" , require: true },
  founder: { type: Schema.Types.ObjectId, ref: "User" , require: true },
  collectionId: { type: Schema.Types.ObjectId, ref: "Collection", require: true },
  pId: { type: Schema.Types.ObjectId, ref: "Folder" }
}, options);

module.exports = model('Folder', folderSchema);   