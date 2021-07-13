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

下面我们简单的了解一下装饰器的使用
```ts
function Greeter(target: Function): void {
  target.prototype.greet = function (): void {
    console.log('hellow!');
  }
}

@Greeter
class Greeting {
  constructor() {
    // 内部实现
  }
}

let myGreeting = new Greeting();
myGreeting.greet();
```
当多个装饰器应用于一个声明上，它们求值方式与复合函数相似。在这个模型下，当复合f和g时，复合的结果(f ∘ g)(x)等同于f(g(x))。

同样的，在TypeScript里，当多个装饰器应用在一个声明上时会进行如下步骤的操作：

1.由上至下依次对装饰器表达式求值。

2.求值的结果会被当作函数，由下至上依次调用。

## 利用装饰器实现缓存
在开发过程中，我们可能需要对某些数据添加缓存，而这些数据可能已经持久化存储了。如果在进程启动时就加载到内存中，如果数据发生了变化就没有办法动态的去更新。

我遇到的一个场景是读取配置文件，这个配置文件可能会被修改，为了避免读取操作的重复发送，需要一个可过期的缓存来存储数据。

```ts
// 定义了一个缓存函数返回值的装饰器
const Cache: (milesecond: number) => MethodDecorator = (milesecond: number) => (target: any, key, desc: any) => {
  const method = desc.value;
  desc.value = (...args) => {
    if (desc.cacheData) {
      return desc.cacheData;
    }
    const result = method.call(this, args);
    desc.cacheData = result;
    return result;
  }
  setInterval(() => {
    desc.cacheData = null;
  }, milesecond);
}

// 利用缓存装饰器在读取文件时进行缓存
//缓存30s
@Cache(30000)
getConfig() {
  const userPath = os.homedir();
  const configPath = path.join(userPath, 'config.json');
  fs.ensureDirSync(path.dirname(configPath));
  if (fs.existsSync(configPath)) {
    const config: { [key: string]: string[] } = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return config;
  } else {
    return {};
  }
}
```

## 使用TypeOrm了连接数据库
了解了装饰器的基本用法之后，我们接下来就可以使用TypeOrm来连接数据库处理数据了。

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
