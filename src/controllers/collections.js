const Collection = require('../models/collections');
const Folder = require('../models/folders');

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

  // 查询这个人这个项目下的所有集合
  async queryList(ctx) {
    const projectId = ctx.params.id
    const userId = ctx.state.user.id
    const collectionList = await Collection.find({ $and: [{ founder: userId }, { project: projectId }] })
    // 这里呢，我们是拿到了所有的集合，但是还缺东西。
    // 集合下面应该有接口和文件夹，而文件夹下也会有接口和文件夹，但是他们有一个统一的地方，就是同一个 projectId。
    // 因为暂时只写到文件夹这里，就不处理接口的问题
    // 所以我的做法是，先找到所有的 projectId 下的文件夹，递归数组，找到pid不为null的数组，挂在到数组中对应的对象的children里，再剔除掉自己。
    // 最后数组中就全部是pid为空的文件夹了，挂在到对应的集合children下就ok了。

    // 1 先找到全部的文件夹
    const folders = await Folder.find({ project: projectId })

    // 2. 把数组直接的父子级关系给理清了
    let mapFolders = folders.map(folder => {
      const mapoFolder = folder.toObject()
      mapoFolder.children = []
      return mapoFolder
    })
    mapFolders.forEach(folder => {
      if (folder.pId) { // 假如存在代表这个至少是2级的目录，肯定能挂在到别人身上
        mapFolders.find(item => item._id.toString() === folder.pId.toString()).children.push(folder)
      }
    })

    // 3. 把有pid的给清出去，留下的都是集合根目录下的
    mapFolders = mapFolders.filter(folder => !folder.pId)
    // 4. 把全部的集合对象变成普通的对象，便于我添加children，同时顺便看下有没有文件夹能让我挂载
    let mapCollectionList = collectionList.map(collection => {
      const mapCollection =  collection.toObject()
      mapCollection.children = []
      const findmapFolders = mapFolders.filter(folder => folder.collectionId.toString() === mapCollection._id.toString())
      mapCollection.children.push(...findmapFolders)
      return mapCollection
    })
    //  至此，文件夹的问题得以解决
    ctx.body = mapCollectionList
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