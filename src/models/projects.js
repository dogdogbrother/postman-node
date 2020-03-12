const { Schema, model, options } = require('./config')

//  参数有，名字、描述、发起人、参与者

const projectSchema = new Schema({
  createdAt: { type: String, select: false },
  updatedAt: { type: String, select: false },
  name: { type: String, require: true },
  describe: { type: String, default: '' },
  founder: { type: Schema.Types.ObjectId, ref: "User" , require: true},
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: []
  }
}, options);

module.exports = model('Project', projectSchema);   