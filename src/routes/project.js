const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  queryAll,
  queryProject,
  create,
  edit,
  deletePreoject,
  addMember,
  queryMember,
  quitMember,
  deleteMember
} = require('../controllers/projects')

const projectsRouter = new Router({prefix:'/project'})

projectsRouter.get('/all', auth, queryAll) //  创建个项目
projectsRouter.get('/:id', auth, queryProject) //  创建个项目

projectsRouter.post('/', auth, create) //  创建个项目
projectsRouter.put('/:id', auth, edit) //  修改这个项目名词和描述
projectsRouter.delete('/:id', auth, deletePreoject) //  删除个项目
projectsRouter.put('/:id/member', auth, addMember) //  给项目添加成员
projectsRouter.get('/member/:id', auth, queryMember) //  获取项目开发成员
projectsRouter.delete('/member/:projectId/:memberId', auth, deleteMember) //  获取项目开发成员
projectsRouter.delete('/quit/:id', auth, quitMember) //  项目开发成员主动退出


module.exports = projectsRouter