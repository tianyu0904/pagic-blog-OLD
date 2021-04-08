---
categories:
  - 开发者手册
tags:
  - TypeScript
  - Node.js
timeline:
  - 2021-04-03 20:34:50 创建文档
  - 2021-04-03 23:55:04 Koa基本概念 Demo构建
---

# 从零开始的Node.js (02) - Koa 框架

## 什么是Koa
> Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

Koa是一个类似于Express的Web开发框架，创始人也是同一个人。它的主要特点是，使用了ES6的Generator函数，进行了架构的重新设计。也就是说，Koa的原理和内部结构很像Express，但是语法和内部结构进行了升级。

“为什么koa不是Express 4.0？”

官方回答是这样的：“Koa与Express有很大差异，整个设计都是不同的，所以如果将Express 3.0按照这种写法升级到4.0，就意味着重写整个程序。所以，我们觉得创造一个新的库，是更合适的做法。”

## 第一个Koa项目

首先我们要下载 koa 的 npm 包。因为该项目准备使用 TypeScript ，所以同时安装了相关的类型包。

```shell
npm install koa koa-router
npm install --save-dev typescript ts-node nodemon
npm install --save-dev @type/koa @type/koa-router
```

依据架构，建立文件夹

```bash
typescript-demo
├── dist
├── src
|   ├── demo
|       └── hello.js
|   └── server
|       ├── api
|       ├── config
|       ├── router
|       ├── service
|       └── index.ts
├── .gitignore
├── package.json
└── tsconfig.json
```

打开 index.ts 编写如下代码。

```ts
  import Koa from 'koa';
  import Router from "koa-router";

  const app = new Koa();
  const router = new Router();

  router.get('/', async (ctx) => {
    ctx.body = "Hello Node.js!";
  })

  app.use(router.routes());

  app.listen(3000);

  console.log("Server is running on port 3000");
```

打开 package.json 在 script 中添加如下脚本

```json
  "build": "cross-env rm -rf dist/* && tsc && node ./dist/server/index.js",
  "dev": "cross-env nodemon --watch 'src/***/*' -e ts,tsx --exec 'ts-node' ./src/server/index.ts",
  "test": "echo \"Error: no test specified\" && exit 1"
```

然后在命令行输入 `npm run dev` 这样一个简单的基于 koa 的 node.js 服务器就架设好了。

>tip: 如果在 window 系统中出现无法识别命令的情况，请全局安装 `cross-env` 包。并在上面的脚本前添加 `cross-env`

启动服务器后，在浏览器地址栏输入 `localhost:3000/` 即可访问到服务器。

## 中间件
中间件是介于应用系统和系统软件之间的一类软件，它使用系统软件所提供的基础服务（功能），衔接网络上应用系统的各个部分或不同的应用，能够达到资源共享、功能共享的目的。

Koa的中间件主要通过 `app.use()` 函数添加。

比如最常见的 `koa-router`

```ts
import Koa from 'koa'
import Router from 'koa-router'

const app = new Koa();
const router = new Router();

// url匹配
router.get('/', async (ctx) => {
    ctx.type = 'html';
    ctx.body = '<h1>hello world!</h1>';
})

// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
// 调用router.allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
app.use(router.routes());

app.listen(3000, () => {
    console.log('应用已经启动，http://localhost:3000');
})
```

## 参考
- [本文相关示例 github](https://github.com/tianyu666/typescript-demo)


<footer>
  <nav class="navbar-fixed-bottom text-center navbar-default">
    <text style="font-size: 14px;">Copyright © 2019-2021 tianyu007.com. All rights reserved. </text>
    <a href="https://beian.miit.gov.cn" style="font-size: 12px;">辽ICP备15016458号</a>
    <script type="text/javascript">
      var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
      document.write(unescape("%3Cspan id='cnzz_stat_icon_1258928019'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s11.cnzz.com/z_stat.php%3Fid%3D1258928019%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));
    </script>
  </nav>
</footer>
