const Collection = require('../models/collections');
const Folder = require('../models/folders');
const Requset = require('../models/requests');

class CollectionCtl {
  // 创建个集合
  async create(ctx) {
    const projectId = ctx.params.id
    const userId = ctx.state.user.id
    const collection = await new Collection({
      ...ctx.request.body,
      founder: userId,
      project: projectId,
      requestTotal: 0
    }).save()
    const mapCollection = collection.toObject()
    mapCollection.children = []
    ctx.body = mapCollection
  }

  // 查询这个人这个项目下的所有集合，不仅要查集合，还有文件夹和接口
  async queryList(ctx) {
    const projectId = ctx.params.id
    // 1. 我们先找到这和项目下的所有的集合和文件夹，遍历循环加上children
    const collectionList = await Collection.find({ project: projectId }, null, { lean:true })
    let folders = await Folder.find({ project: projectId }, null, { lean:true })
    collectionList.forEach(collection => collection.children = [])
    folders.forEach(folder => folder.children = [])

    // 2. 找到所有的接口,遍历他，让他进入集合或是文件夹下
    const requests = await Requset.find({ project: projectId })
    requests.forEach(request => {
      if (request.folder) {
        const folder = folders.find(folder => folder._id.toString() === request.folder.toString())
        folder.children.push(request)
      } else {
        const collection = collectionList.find(collection => collection._id.toString() === request.collectionId.toString())
        collection.children.push(request)
      }
    })

    // 3. 先翻转数组，是因为文件夹是正序的，而我是要unshift的。再遍历所有的文件夹，如果这个文件夹有父级，就从自身找到这个父级，然后把子级添加到头部
    folders.reverse()
    folders.forEach(folder => {
      if (folder.pId) { // 假如存在代表这个至少是2级的目录，肯定能挂在到别人身上

        folders.find(item => item._id.toString() === folder.pId.toString()).children.unshift(folder)
      }
    })
    // 4. 把有pid的给清出去，留下的都是集合根目录下的
    folders = folders.filter(folder => !folder.pId)

    // 5. 下载文件夹数组里面是全部等待挂载到集合里面的,主要文件夹是在接口的上面的，所以
    collectionList.forEach(collection => {
      const findFolders = folders.filter(folder => folder.collectionId.toString() === collection._id.toString())
      collection.children.unshift(...findFolders)
    })
    //  至此，集合、文件夹、接口的嵌套问题得以解决
    ctx.body = collectionList
  }

  async remove(ctx) {
    const id = ctx.params.id
    await Collection.findByIdAndRemove(id)
    ctx.status = 204
  }

  async reName(ctx) {
    const id = ctx.params.id
    // 这个地方有问题，就是可以一个查询写 我写了2个，后嗷面改
    await Collection.findByIdAndUpdate(id, ctx.request.body)
    const collection = await Collection.findById(id)
    ctx.body = collection
  }

}
module.exports = new CollectionCtl()