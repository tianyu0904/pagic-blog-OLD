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
  - 2021-04-05 21:26:36 写入文件
  - 2021-04-05 22:05:21 上传文件到服务器
---

# Node.js 如何实现文件的上传下载（导入导出）
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

学会了如何读取文件，那当然也要会写文件。一些需要保存的数据可以写到文件中保存，以便后期查看。

新建文件 file_save.ts

```ts
  import fs from 'fs';

  const date = Date.now();

  const info = {
    fileName: "testfile.json",
    createtime: date,
    data: [
      {
        firstname: "aaa",
        lastname: "aaa"
      },
      {
        firstname: "bbb",
        lastname: "bbb"
      }
    ]
  }

  // 异步写入
  console.log("异步文件写入开始");
  fs.writeFile('./public/file_saved/write_1.json', JSON.stringify(info), function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("异步写入成功！");
  });
  console.log("异步文件写入结束");

  // 同步写入
  console.log("同步文件写入开始");
  fs.writeFileSync('./public/file_saved/write_2.json', JSON.stringify(info));
  console.log("同步写入成功！");
  console.log("同步文件写入结束");
```

上面就是利用 fs 写文件的方法。使用 `tsc` 编译，然后使用 `node` 命令运行。

> Tips: 这种写文件的方式只适用于新建文件夹。如果存放位置已存在同名文件，则会被覆盖。

## 本地到服务器

简单的文件读取和写入我们已经在上面尝试过了，下面我们来模拟一下用户从本地上传文件到服务器的过程。

首先我们先新建一个 html 文件供用户上传。

```html
 <html>
 <head><title>文件上传</title></head>
  <body>
    <form action="http://localhost:3000/api/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" id="file" value="" multiple="multiple" />
      <input type="submit" value="提交"/>
    </form>
  </body>
 </html>
```

前端部分比较简单，只需要一个form就可以搞定。下面我们来看后端如何实现。

首先在 koa 中间件中添加 KoaBody 引用
> Tips `Koa-Body` 中间件需要在路由之前，否则可能出现读取不到文件的情况

```ts
  import KoaBody from "koa-body";

  app.use(KoaBody({
    multipart: true,  // 多文件上传
    formidable: {
      maxFileSize: 10 * 1024 * 1024 * 1024  // 文件大小限制
    }
  }));
```

然后设置路由，对外提供一个Url上传地址

```ts
router.post('/api/upload', async (ctx) => {

})
```

接下来我们准备一些文件操作的工具方法。

> 生成文件夹（此处按时间分类）。
```ts
  const getDirName: () => string = (): string => {
    const date = new Date();
    const monthNumber: number = date.getMonth() + 1;
    const month: string = monthNumber.toString().length > 1 ? monthNumber.toString() : `0${monthNumber}`;
    const dir: string = `${date.getFullYear()}${month}${date.getDate()}`;
    return path.join('./public/file_upload/', dir);
  }
```
> 检查文件夹路径是否存在，如果不存在则创建文件夹(此处不支持创建多级文件夹)。
```ts
  const checkDirExist: (dir: string) => void = (dir: string): void => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
```
> 生成新的文件名(如果不改变文件名，此方法可以忽略)。
```ts
  const getFileName: (name: string) => string = (name: string): string => {
    const now = Date.now();
    const ext = name.split('.');
    const newname = md5(`${name}|${now}`);
    const filename = `${newname}.${ext[ext.length - 1]}`;
    return filename;
  }
```

工具类创建好之后，我们就要对传进来的数据进行处理啦。

```ts
  router.post('/api/upload', async (ctx) => {
    if (!ctx.request.files) {
      console.log('上传的文件为空！');
      return;
    }
    const data = ctx.request.files.file;
    let files = [];
    if (!Array.isArray(data)) {
      files.push(data);
    } else {
      files = data
    }
    files.forEach((element) => {
      // 创建可读流
      const reader = fs.createReadStream(element.path);
      // 确认文件存储位置
      const rootPath = path.join('./public/file_upload/');
      checkDirExist(rootPath);
      const filePath = path.join(rootPath, getDirName());
      checkDirExist(filePath);
      // 新的文件名
      const fileName = getFileName(`${element.name}`);
      // 创建可写流
      const upStream = fs.createWriteStream(`${filePath}/${fileName}`);
      // 可读流通过管道写入可写流
      reader.pipe(upStream);
    });
    return ctx.body = "上传成功！";
  });
```

运行 npm run dev 之后，打开之前创建好的 html 文件，选好文件点击上传，就可以在服务端文件夹看到上传的文件啦。

上面的是异步多文件保存的例子。下面是使用Promise方法，单文件上传同步返回结果的例子。
```ts
  router.post('/api/uploadsingle', async (ctx) => {
    if (!ctx.request.files || JSON.stringify(ctx.request.files.file) == '{}' || !ctx.request.files.file) {
      throw new Error('未读取到文件');
    }
    const file = ctx.request.files.file;
    if (Array.isArray(file)) {
      throw new Error('仅支持单文件上传');
    }
    if (file.size < 1000) {
      throw new Error('文件小于1kb');
    }
    const rootPath = path.join('./public/file_upload/');
    checkDirExist(rootPath);
    const filePath = path.join(rootPath, getDirName());
    const fileName = getFileName(file.name ? file.name : '');
    checkDirExist(filePath);
    await saveFile(file, `${filePath}/${fileName}`).then(() => {
      // do something like upload file to cloud.
      ctx.body = '上传成功';
    }).catch((err) => {
      throw new Error(err.message);
    });
  });
```
这里使用了 `saveFile` 方法， 该方法返回了一个Promise对象。
```ts
  const saveFile = (file: any, path: string) => {
    return new Promise((resolve, reject) => {
      const reader = fs.createReadStream(file.path);
      // console.log({ name: file.name, size: file.size, path: `${filePath}/${fileName}` });
      const writeStream = fs.createWriteStream(path);
      reader.pipe(writeStream);
      writeStream.on('finish', () => {
        resolve(true);
      });
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  }
```

大部分情况下，我们并不建议将上传的文件存储到项目目录。这里推荐一个库 [os](https://www.npmjs.com/package/os)。
```ts
// 使用这个库可以很方便的获取当前系统的用户文件夹。
import os from 'os';

const homedir = os.homedir();
```

## 参考
- [本文相关示例 github](https://github.com/tianyu666/typescript-demo)
- [NodeJs koa2实现文件上传](https://www.jianshu.com/p/34d0e1a5ac70)


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
