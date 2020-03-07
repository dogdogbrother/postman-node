const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  queryAll,
  create,
  edit,
  deletePreoject,
  addMember,
  queryMember,
  quitMember
} = require('../controllers/projects')

const projectsRouter = new Router({prefix:'/project'})

projectsRouter.get('/all', auth, queryAll) //  创建个项目
projectsRouter.post('/create', auth, create) //  创建个项目
projectsRouter.patch('/:id', auth, edit) //  修改这个项目名词和描述
projectsRouter.delete('/:id', auth, deletePreoject) //  删除个项目
projectsRouter.put('/:id/member', auth, addMember) //  给项目添加成员
projectsRouter.get('/member/:id', auth, queryMember) //  获取项目开发成员
projectsRouter.delete('/quit/:id', auth, quitMember) //  项目开发成员主动退出


module.exports = projectsRouter