const Requst = require('../models/requests');

class FolederCtl {
  // 创建个文件夹
  async create(ctx) {
    // 需要注意的是，如果没有pid，就是集合的根目录，
    const userId = ctx.state.user.id
    const request = await new Requst({
      ...ctx.request.body,
      founder: userId
    }).save()
    ctx.body = request
  }

  // 删除某个文件夹
  async remove(ctx) {
    const requestId = ctx.params.id
    await Requst.findByIdAndRemove(requestId)
    ctx.body = 204
  }

  async reName(ctx) {
    ctx.body = await Requst.findByIdAndUpdate(ctx.params.id, ctx.request.body,{ new: true })
  }
}

module.exports = new FolederCtl()