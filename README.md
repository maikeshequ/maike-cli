# maike-cli

## 插件简介
#### maike-cli 插件是项目快速初始化工具及管理工具，包含
#### web 前端（可用于移动端或者微信公众号，采用 vant 框架）
#### server 服务（采用 egg.js 模板，用于服务器快速开发）
#### admin/pc 管理后台 （采用 element 模板，用于快速生成管理员后台）
#### create 快速创建egg模块，生成增删改查代码
#### git 一键版本提交

## 如何使用？


#### 1 全局安装 maike-cli

```js
  npm i maike-cli -g
```

#### 2 命令行输入

```shell
  maike-cli -h || maike-cli -help
```
```shell
  输出内容：

  init service [初始化egg空项目]

  init web [初始化移动端空项目]

  init admin [初始化后台管理系]

  create app init [创建模块]

  create app swiper [创建轮播图]

  create app area [创建省市区模]

  git push [git 一键提交代码]
```
#### 4 根据指令快速生成模板套件

```js
 maike-cli init web | service | admin ---
```
#### 5 模块生成器，包括创建模块，轮播图，省市区等会直接生成 mvcr 并将路由注册到主路由，同步数据库后即可使用功能接口

#### 6 附加 模块中使用的 await ctx.toSuccess() & await ctx.toError() 可以自定义

##### 创建文件 /PATH_TO_APP/app/extend/context.js

```js
  'use strict';
  const _success = '操作成功'
  const _error = '操作失败'
  module.exports = {
    async toSuccess(msg = null, rows = null, count = null) {
      if (rows !== null && count !== null) {
        return {
          code: 1,
          msg: msg ? msg : _success,
          count,
          data: rows,
        };
      } else if (rows != null && count === null) {
        return {
          code: 1,
          msg: msg ? msg : _success,
          data: rows,
        };
      }
      return {
        code: 1,
        msg: msg ? msg : _success,
      };
    },
    async toError(msg = null) {
      // 记录日志
      return {
        code: 0,
        msg: msg ? msg : _error,
      };
    },
  }
```

---


## 前提

 #### 你的电脑需要已经配置好 node npm git