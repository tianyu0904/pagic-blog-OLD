---
categories:
  - 开发者手册
tags:
  - TypeScript
  - Node.js
  - TypeOrm
timeline:
  - 2021-04-05 23:30:28 创建文档
  - 2021-04-05 00:27:30 Mysql数据库连接
  - 2021-04-05 00:38:10 方法类需求分析
---

# 从零开始的Node.js (02) - MySql
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

然后在 service 文件夹新建 mysql 的处理文件`mysql.service.ts`

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

因此，先暂定以下几个方法： `sqlSelect`, `sqlAdd`, `sqlUpdate`, `sqlDelete`

方法名确定之后，我们来考虑一下需要传入什么参数。首先是`表名`，然后是我们要操作的`字段`，对于添加和修改来说，还需要字段的`值`。


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
