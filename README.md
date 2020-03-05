## TUDO

1. 当我删除一个项目的时候，其实我要为所有的成员都建立一个站内信，系统小心，名为某某群管理员某某，将群解散了。ok
2. 当我解决了第一个问题的时候，我发现了一个待改进的点。就是我发现系统消息就是应该由后端在保存的时候弄好了，而不是再取的时候再保存。ok
3. 优化下邀请人时，站内信循环插入的问题。 ok
4. 当我邀请开发者进入的时候，还要让开发者参与到这个项目中来。这个其实搜索所以的项目中的members是否有登陆者就行了。ok
5. 这里我就要弄前端了。把我参与的项目模块也给弄一下。ok
6. 前端写好了 `/api/project/quit/${id}` 接口补一下就行了，把项目中的members的userid去掉。 ok
7. 前端写好了新建集合，这个接口怎么写呢？这个集合应该是一个model。 collection
   1. 所以先定义model ok
   2. 写集合的增删改查 ok

8. 补齐新建项目的修改


## 开始写前端
1. 点击最左侧，进入开发模式,一个新的页面 开发个一点 (样式大工程，需要周期，下面就是分期开发)

## 前端的分期开发
1. 新建集合，点击打开dialog，有名name和描述，参数要带上projectId 写好了

## 待优化的点
1. 我发现个问题，就是info信息不能一股脑的让gist接口去拿，因为如果我进去接口开发页面，再次刷新就没有info，因为info是从profile去拿的。
解决方法从2方面入手，一是注册或是登录后直接拿到info信息。第二是把info信息给app.js文件去执行 (未开发)

## 记录下ID的问题
用户a001 id为 5e6050d7d1a9353eb35af112

token为 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNjA1MGQ3ZDFhOTM1M2ViMzVhZjExMiIsInVzZXJuYW1lIjoiYTAwMSIsImlhdCI6MTU4MzM3MDU1MywiZXhwIjoxNTgzOTc1MzUzfQ.-MlXiAurcFNgi8xo94qQ334sMFF7VEiynoUlkDNvxJU

项目1，id为 5e605171d1a9353eb35af113

集合1，id为 5e605180d1a9353eb35af114

<!-- 第一级的测试文件夹的id为 5e5f6c05a65c4036576f995d -->

<!-- 第二级的测试文件夹的id为 5e5f7bcb2cbe18386ba4b758 -->