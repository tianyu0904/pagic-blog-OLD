---
categories:
  - 开发者手册
tags:
  - TypeScript
  - Node.js
  - TypeOrm
timeline:
  - 2021-04-05 23:30:28 创建文档
  - 2021-04-06 00:27:30 Mysql数据库连接
  - 2021-04-06 00:38:10 方法类需求分析
  - 2021-04-06 01:12:30 方法类初始化代码
  - 2021-04-06 16:11:12 插入方法
  - 2021-04-06 16:20:49 查询方法
---

# 从零开始的Node.js (03) - MySql
作为后端程序员，大部分工作其实都是在处理各种数据。所以对于数据库并不陌生。那么如何使用 TypeScript 语言在 Node.js 环境下操作数据库呢。本篇文章就从这里开写。

## Mysql简介
MySQL是一个关系型数据库管理系统，由瑞典MySQL AB公司开发，属于 Oracle 旗下产品。MySQL 是最流行的关系型数据库管理系统之一，在 WEB 应用方面，MySQL是最好的关系数据库管理系统应用软件之一。

关系数据库管理系统（Relational Database Management System：RDBMS）是指包括相互联系的逻辑组织和存取这些数据的一套程序 (数据库管理系统软件)。关系数据库管理系统就是管理关系数据库，并将数据逻辑组织的系统。

## 连接Mysql
现在开发环境安装mysql服务端。[官网下载页](https://dev.mysql.com/downloads/)

安装 mysql 的npm包和类型文件

```shell
npm install mysql
npm install --save-dev @types/mysql
```

在 config 文件夹新建mysql配置文件`mysql.config.ts`

```ts
  const defaultConfig = {
    host:'localhost',
    database:'test',
    user:'test',
    password:'test',
    port:3306
  }
  export default defaultConfig
```

然后在 service 文件夹新建 mysql 的处理文件`mysql.query.ts`

```ts
import mysql from 'mysql';
import mysqlConf from '../config/mysql.config';

const sqlQuery = (sql: string) => {
  const conn = mysql.createConnection(mysqlConf);
  conn.connect()
  return new Promise((resolved, rejected) => {
    conn.query(sql, (result) => {
      if (result === null) {
        rejected(null);
      } else {
        resolved(result);
      }
    });
  });
}
```

这样我们就连接上数据库，并且可以通过sql语句操作数据了。

不过这样的方法显然不够让人满意。我们需要为每次操作都编写不同的sql语句。使用起来十分不方便。

因此，我们需要一个工具类来帮我们处理一些基本的数据库操作。

## 实现Mysql方法类

在编写方法类的时候，我们要先确定自己的需求。最基本的是要完成增删改查操作。我们需要它帮我们拼接字符串，连接数据库，并返回我们需要的结果。

因此，先暂定以下几个方法： `sqlSelect`, `sqlInsert`, `sqlUpdate`, `sqlDelete`

方法名确定之后，我们来考虑一下需要传入什么参数。首先是`数据库名`、`表名`，然后是我们要操作的`字段`，对于添加和修改来说，还需要字段的`值`。

确定了方法的基本信息后，我们开始编写。打开`mysql.helper.ts`

```ts
import mysql from 'mysql';
import mysqlConf from '../config/mysql.config';

export class MysqlHelper {
  private conn;
  private table;
  constructor(database: string, table: string) {
    this.conn = mysql.createConnection(mysqlConf);
    this.table = table;
  }
  // 初始化后需执行该方法建立连接
  connect() {
    this.conn.connect((err) => {
      if (err) {
        console.log(this.table + " 连接失败");
        // 重新连接
        setTimeout(this.conn.connect, 2000);
        return;
      }
      console.log(this.table + " 连接成功");
      // 定时监控
      setInterval(() => {
        console.log('ping...');
        this.conn.ping((err) => {
          if (err) {
            console.log('ping error: ' + JSON.stringify(err));
          }
        });
      }, 600000);
    });
  }
}
```

上面的代码是你初始化过程。先连接数据库，然后定时监控，出现错误后自动重连。

接下来我们继续编写具体的操作方法。

1. 插入操作
```ts
  insert(insertObj: any) {
    var addKey = [];
    var addVal = [];
    //解析insertObj对象，拆分为数组方便后续处理
    for (let i in insertObj) {
      addKey.push(i);
      addVal.push(insertObj[i]);
    }
    //键值对不匹配，返回错误文档。
    if (addKey.length != addVal.length) {
      throw new Error('insert错误，列和值数目不匹配');
    }
    //拼接SQL字符串
    var str = `insert into ${this.table} (`;
    for (let i = 0; i < addKey.length; i++) {
      str += addKey[i] + ",";
    }
    str = str.substr(0, str.length - 1);
    str += ") values (";
    //判断value类型，Mysql区分数字和字符
    for (let i = 0; i < addVal.length; i++) {
      if (typeof (addVal[i]) == "string")
        str += "'" + addVal[i] + "',";
      else
        str += +addVal[i] + ",";
    }
    str = str.substr(0, str.length - 1);
    str += ");";
    //真查询+异步回调
    return createAsyncAction(this.conn, str)
  }
```

使用方法
```ts
  const mysqlConn = new MysqlHelper('test', 'user1');
  mysqlConn.connect();
  await mysqlConn.insert({
    "firstname": "first",
    "lastname": "last"
  })
```

2. 查询操作
```ts
  select(queryObj: any) {
    var str = "";
    if (queryObj == {}) {
      str = `select * from ${this.table}`
    }
    else {
      str = `select * from ${this.table} where `;
      // 区分类型
      for (var i in queryObj) {
        if (typeof (queryObj[i]) == "string") {
          str += `${i}='${queryObj[i]}' and `;
        }
        else {
          str += `${i}=${queryObj[i]} and `;
        }
      }
      // 清除最后的多余字段
      str = str.substr(0, str.length - 4);
    }
    //返回promise
    return createAsyncAction(this.conn, str)
  }
```

使用方法
```ts
  const mysqlConn = new MysqlHelper('test', 'user1');
  mysqlConn.connect();
  const result = await mysqlConn.select({"id": 1});
  console.log(result);
```

3. 修改操作
```ts
  async update(selectObj: any, updateObj: any) {
    //注意，这里的updateObj没必要把所有参数穿进去，只要把需要更新的字段和值传进来就可以，Kid就可以帮你补全剩下的数据了
    const data: any = await this.select(selectObj)
    if (data.length == 0) {
      throw new Error('update错误，没有匹配到数据');
    }
    const oldData = data[0];
    //获取旧数据，比较新旧数据的键是否匹配
    var str = `update ${this.table} set `;
    for (let u in updateObj) {
      //用旧数据的键比对传参的键
      if (oldData[u] === undefined)
      throw new Error('update错误，输入键和源数据不匹配');;
      oldData[u] = updateObj[u];
    }
    //区分类型
    for (let o in oldData) {
      if (typeof (oldData[o]) == 'string')
        str += `${o} = '${oldData[o]}',`;
      else
        str += `${o} = ${oldData[o]},`;
    }
    str = str.substr(0, str.length - 1);
    str += ` where `;
    for (var i in selectObj) {
      if (typeof (selectObj[i]) == "string") {
        str += `${i}='${selectObj[i]}' and `;
      }
      else {
        str += `${i}=${selectObj[i]} and `;
      }
    }
    // 清除最后的多余字段
    str = str.substr(0, str.length - 4);
    return createAsyncAction(this.conn, str)
  }
```

使用方法
```ts
  await mysqlConn.update({"id": 1}, {"lastname": "newlast"});
  const newresult = await mysqlConn.select({"id": 1});
  console.log(newresult);
```

4. 删除操作
```ts
```

使用方法
```ts
```

## 优化mysql方法类

## 参考


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
