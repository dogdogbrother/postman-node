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
    const { collectionId, folderId }= ctx.params
    // 怎么删除，一个文件夹下有可能有接口和文件夹，可以一直嵌套下去的，我的想法是，和查询集合一个思路
    // 把所有此集合下的的文件夹全部都找出来，放到一个数组里面，然后不停的递归查询，知道没有Pid能对的上，再把刚才找到的全部都给
    const folderList = await Folder.find({ $and: [{ collectionId }, { pId: { $exists: true } }] })
    // 这里的递归是自己递归自己，比较有难度，我的做法是这样的，每次递归找到下一层，然后把全部的id整合起来，再用includes判断下下一级是否包含了，如此递归
    let flagArr = [folderId]
    const awaitDelete = [folderId]
    while(flagArr.length) {
      const casuallyArr = folderList.filter(folder => flagArr.includes(folder.pId.toString()))
      const idString = casuallyArr.map(item => item._id.toString())
      awaitDelete.push(...idString)
      flagArr = idString
    }
    await Folder.remove({ _id: { $in: awaitDelete }})
    ctx.body = 204
  }

  async reName(ctx) {
    ctx.body = await Folder.findByIdAndUpdate(ctx.params.id, ctx.request.body,{ new: true })
  }
}

module.exports = new FolederCtl()