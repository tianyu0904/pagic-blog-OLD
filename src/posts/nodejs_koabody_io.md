---
categories:
  - 开发者手册
tags:
  - TypeScript
  - Node.js
  - Koa
  - Koa-body
timeline:
  - 2021-04-02 17:12:48 创建文档
  - 2021-04-03 23:56:58 环境准备
  - 2021-04-04 22:13:52 读取文件
---

# Node.js 如何实现文件的上传下载（导入导出）。
> 文件操作是每个服务端程序员都会遇到的需求。那么如何在Node.js环境下使用Koa-body来完成文件的上传和下载呢，本文将一步一步引导大家完成这个功能。

## 开发环境准备

我们这次的目的是完成一个文件处理的Demo，所以不需要额外的服务器，只需要本地的开发环境即可。

> IDE：Visual Studio Code  
> 架构：Node.js + Koa

1. 安装 TypeScript 编译器，具体操作请看 [从零开始的Node.js (01) - 初识TypeScript](./typescript_koa_01.md)。
2. 新建 NodeJS 项目，具体操作请看 [从零开始的Node.js (02) - Koa 框架](./typescript_koa_02.md)。

## 文件的读取

在项目开发的过程中，我们经常会遇到读取配置文件的需求，那么，如何在 Node.js 环境中读取服务器上的文件呢？

新建一个配置文件 config.json

```json
  {
    "id": 1,
    "time": "2021-04-04 10:10",
    "data": {
      "firstname": "Will",
      "lastname": "Smith"
    }
  }
```

接下来，我们新建文件 file_load.ts 用来读取配置文件并输出到控制台。

```ts
  import fs from 'fs';

  const readfileAsync = (path: string) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        console.error(err.message);
      }
      console.log(data);
    });
  }

  console.log('读取文件');
  readfileAsync('./public/file_saved/config.json');
  console.log('读取结束');
```

在命令行输入 `tsc` 编译。然后使用 `ndoe file_load.js` 运行。

这时命令行就会输出文件内的内容。

我们会发现，这时读取操作是异步执行。异步读取不会阻塞进程，效率比较高。下面是同步的写法，不建议使用。

```ts
  console.log('同步读取文件');
  const data = fs.readFileSync('./public/file_saved/config.json');
  console.log("同步读取: " + data.toString());
  console.log('同步读取结束');
```

## 文件的保存

## 本地到服务器

## 参考
- [本文相关示例 github](https://github.com/tianyu666/typescript-demo)


<footer>
  <nav class="navbar-fixed-bottom text-center navbar-default">
    <text style="font-size: 14px;">Copyright © 2019-2021 tianyu007.com. All rights reserved. </text>
    <a href="http://www.beian.miit.gov.cn" style="font-size: 12px;">辽ICP备15016458号</a>
    <script type="text/javascript">
      var cnzz_protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
      document.write(unescape("%3Cspan id='cnzz_stat_icon_1258928019'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s11.cnzz.com/z_stat.php%3Fid%3D1258928019%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));
    </script>
  </nav>
</footer>
