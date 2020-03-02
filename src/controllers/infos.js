const Info = require('../models/infos');

class InfoCtl {
  // 创建了个信息
  async inviteMsg(ctx) {
    ctx.verifyParams({
      addressee: { type: 'Boolean', required: true }
    })
  }

  async list(ctx) {
    const userId = ctx.state.user.id
    const infoList = await Info.find({ addressee:userId })
    ctx.body = infoList
  }

  async read(ctx) {
    const infoId = ctx.params.id
    await Info.findByIdAndUpdate(infoId, { isRead: true })
    ctx.status = 204
  }
}
module.exports = new InfoCtl()