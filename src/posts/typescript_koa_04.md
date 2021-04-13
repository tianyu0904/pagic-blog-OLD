---
categories:
  - 开发者手册
tags:
  - TypeScript
  - Node.js
  - TypeOrm
timeline:
  - 2021-04-11 20:24:08 创建文档
---

# 从零开始的Node.js (04) - 装饰器
装饰器模式（Decorator Pattern）允许向一个现有的对象添加新的功能，同时又不改变其结构。这种类型的设计模式属于结构型模式，它是作为现有的类的一个包装。

这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能。

## 什么是装饰器
装饰器目前还是实验性特性，想要使用先要在 `tsconfig.json` 中启用 `experimentalDecorators` 编译器选项。

下面我们利用装饰器来实现一个计算函数运行时间的方法，
```ts
function sleep(){
  return new Promise((resolve, reject)=> {
    setTimeout(()=>{
      resolve()
    }, 3000)
  });
}
```

## 利用装饰器修饰实体的属性

## 参考
- [装饰器·TypeScript](https://www.tslang.cn/docs/handbook/decorators.html)


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
