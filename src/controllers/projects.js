const Project = require('../models/projects');
const User = require('../models/users')
const Info = require('../models/infos')
class ProjiectCtl {
  async queryAll(ctx) {
    // 再拿我创建的项目list，用 founder 匹配
    const founders = await Project.find({ founder: ctx.state.user.id });

    // 在所有项目中找到members字段数组里面有我的项目
    const members = await Project.find({ members: ctx.state.user.id });

    ctx.body = {
      founders,
      members
    }
  }

  async create(ctx) {
    ctx.verifyParams({
      projectName: { type: 'string', required: true }
    })
    const { projectName } = ctx.request.body
    let findProject = await Project.findOne({ projectName });
    if (findProject) return ctx.throw(409, '已存在相同名字的项目') 
    await new Project({ 
      ...ctx.request.body,
      founder: ctx.state.user.id
    }).save();
    const projectList = await Project.find({ founder: ctx.state.user.id });
    ctx.body = projectList
  }

  async edit(ctx) {
    ctx.verifyParams({
      projectName: { type: 'string', required: true }
    })
    const projectId = ctx.params.id
    const project = await Project.findById(projectId)
    console.log(project);
    if (project.founder.toString() !== ctx.state.user.id) return ctx.throw(403, '只有项目的管理员才能修改项目信息') 
    // bug,需要2合一暂时不改
    await Project.findByIdAndUpdate(projectId, ctx.request.body)
    const projectList = await Project.find({ founder: ctx.state.user.id });
    ctx.body = projectList
  }

  async deletePreoject(ctx) {
    // 删除一个项目
    const pId = ctx.params.id
    const uId = ctx.state.user.id
    const findProject = await Project.findById(pId);
    if (findProject.founder.toString() !== uId.toString()) return ctx.throw(403, '只有项目的管理者才有权限删除项目')
    await Project.remove({ _id: pId })
    const projectList = await Project.find({ founder: uId });
    // 这里就是把删除项目，并已经把剩下的项目找到给前端了，这样前端就能省下一次请求了
    // 然后我要创建一些站内信，用于通知此项目的开发者
    const userInfos = findProject.members.map(member => {
      return {
        title: '系统消息',
        msg: `${findProject.projectName} 项目已经由管理员解散，您将不再是此项目的开发者。`,
        founder: uId,
        addressee: member,
        isRead: false
      }
    })
    await Info.insertMany(userInfos)
    ctx.body = projectList
  }

  async addMember(ctx) {
    // ctx.verifyParams({
    //   members: { type: 'array', required: true }
    // })
    const { id } = ctx.params // 项目id
    const userId = ctx.state.user.id
    let { members } = ctx.request.body // 需要添加的成员
    if (members.length>10) return ctx.throw(400, '请不要一次过多的添加成员')
    const findProject = await Project.findById(id)
    // 拿到了想要添加成员的项目，但是不能重复添加组员，所以我要过滤下
    members = members.filter(member => {
      return !findProject.members.find(item => item.toString() === member)
    })
    findProject.members.push(...members)
    findProject.save()

    // 到这，给项目添加成员的操作已经完成。
    // 但是还需要一个操作，就是给成员发送站内信，告诉他你被拉进项目了。
    // 这就涉及到了info模块，和websockt

    const users = await User.find({ _id: members })

    const userInfos = users.map(user => {
      return {
        title: "系统消息", 
        msg: `${findProject.projectName} 项目的管理员邀请您进入此项目。`,
        founder: userId,  //  发起人，也就是 jwt 校验人
        addressee: user._id, //  收信人
        isRead: false
      }
    })
    await Info.insertMany(userInfos)
    ctx.body = users
  }

  async queryMember(ctx) {
    const { id } = ctx.params // 项目id
    const project = await Project.findById(id).populate("members")
    ctx.body = project.members
  }

  async quitMember(ctx) {
    const { id } = ctx.params // 项目id
    let { members } = await Project.findById(id)
    members = members.filter(member => member.toString() !== ctx.state.user.id)
    await Project.findByIdAndUpdate(id,{ members })
    ctx.body = await Project.find({ members: id });
  }

  async deleteMember(ctx) {
    // 这个缺少权限校验，就是只有发起者才能踢人，暂时不写了
    const { projectId, memberId } = ctx.params
    console.log(projectId, memberId);
    const project = await Project.findById(projectId).populate("members")
    project.members = project.members.filter(member => member._id.toString() !== memberId)
    await Project.findByIdAndUpdate(projectId, project)
    // 你还可以建立个站内信，但是我就不做了
    ctx.body = project.members
  }
}

module.exports = new ProjiectCtl()