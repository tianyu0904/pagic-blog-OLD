---
categories:
  - 开发者手册
tags:
  - TypeScript
  - Node.js
timeline:
  - 2021-03-29 13:15:48 简介 安装 类型系统
  - 2021-03-29 13:29:12 函数类型
---

# 从零开始的Node.js (01) - 初识TypeScript

## 什么是TypeScript？
> TypeScript 就是 Typed JavaScript 。和字面意思一样。TypeScript 就是带类型系统的 JavaScript 。

TypeScript 是 JavaScript 的一个超集，由微软开发。可通过编译器转译为 JavaScript 代码。

类型系统的存在使得TypeScript可以胜任大型项目。同时TypeScript增强了编辑器的功能，代码补全、接口提示、跳转到定义。使得开发效率大大提升。

## 安装TypeSCript
> 推荐使用Visual Studio Code 编辑器。通过 npm 很轻松的安装 TypeScript 的编译工具。

```shell
npm init
npm install -g typescript
```

以上命令会在全局环境下安装 `tsc` 。TypeScript 编写的文件以 `.ts` 作为文件后缀。

使用 `tsc` 命令初始化开发目录。

```shell
tsc --init
```

以上命令会在当前文件夹下生成 tsconfig.json 文件。[官方文档](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)（[中文手册](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)）

修改 tsconfig.json 。

设置 源文件夹(rootDir) 和 输出文件夹(outDir) ，同时在根目录新建文件夹 src 。

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    "target": "es2017",                             /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                           /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "allowJs": false,                               /* Allow javascript files to be compiled. */
    "outDir": "./dist",                             /* Redirect output structure to the directory. */
    "rootDir": "./src",                             /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */

    /* Strict Type-Checking Options */
    "strict": true,                                 /* Enable all strict type-checking options. */
    "noImplicitAny": true,                          /* Raise error on expressions and declarations with an implied 'any' type. */

    /* Module Resolution Options */
    "moduleResolution": "node",                     /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "esModuleInterop": true,                        /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */

    /* Experimental Options */
    "experimentalDecorators": true,                 /* Enables experimental support for ES7 decorators. */
    "emitDecoratorMetadata": true,                  /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                           /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true        /* Disallow inconsistently-cased references to the same file. */
  }
}
```

> Tips: 
> 1. Windows 环境下需要配置环境变量。
> 2. 提示禁止运行脚本时，需要以管理员身份启动 PowerShell 并执行 `set-executionpolicy RemoteSigned` 选择 A 或 Y 皆可。

## 安装ESLint
> 合理的使用 ESLint 可以避免低级错误的出现，也可以很好的统一代码风格。

```shell
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

在 Visual Studio Code 中添加 ESLint 插件，然后在配置文件中增加对 .ts 文件的检查。

> Tips: 「文件 => 首选项 => 设置」`{"eslint.validate": ["typescript"]}`

## Hello World！
> Hello TypeScript!

在 src 文件夹中新建文件 hello.ts 。
```ts
console.log('Hello World!');
```
然后运行命令 `tsc` 此时 TypeScript 会自动编译 `rootDir` 目录中的 .ts 文件，并按照原有文件结构输出到 `outDir` 文件中。 

```shell
PS C:/demo>node dist/hello.js
Hello World!
```

或许你会问了，这不是和 JavaScript 一样么？

没错，TypeScript 是 JavaScript 的超集，所以很多表达都是一样的。现在我们来尝试使用一下TypeScript的类型系统。

## TypeScript原始数据类型
> TypeScript 的原始数据类型包括：`boolean`、`number`、`string`、`null`、`undefined` 以及 ES6 中的新类型 `Symbol` 和 `BigInt`。、

> Tips: void null undefined
> 1. 在 TypeScript 中，可以用 void 表示没有返回值的函数。
> 2. void 类型的变量只能被赋值为 null 或 undefined 。
> 3. null 和 undefined 是所有类型的子类型，可以赋值给已定义成其他基本类型的变量。 例：`let num: number = undefined;`

尝试在 Hello.ts 下添加如下代码并编译。

```ts
function sayHello1(person) {
  return 'Hello, ' + person;
}

let user1 = 'Tom';
console.log(sayHello1(user1));
```

此时tsc编译器会提示我们 `Parameter 'person' implicitly has an 'any' type.` 。

因为我们在 tsconfig.json 中设置了 `"noImplicitAny": true,` 所以编译器会对未指定类型的变量（Any 类型）报错。

> Tips: 如果是旧项目迁移，这里可以设置为false，同时可以将配置文件中 "allowJs" 的值修改为true。

此时我们在参数 `person` 后添加string类型，`person: string`。

再次运行

```shell
PS C:/demo>node dist/hello.js
Hello World!
Hello, Tom
```

在 TypeScript 中，我们在变量后使用 : 指定变量的类型。

上述例子中，我们用指定 person 参数类型为 string。但是编译为 js 之后，并没有什么检查的代码被插入进来。

这是因为 TypeScript 只会在编译时对类型进行静态检查，如果发现有错误，编译的时候就会报错。而在运行时，与普通的 JavaScript 文件一样，不会对类型进行检查。

所以，在某些情况下，还是需要对传进来的参数进行判断。

```ts
function sayHello2(person: string) {
    return 'Hello, ' + person;
}

let user2 = [0, 1, 2];
console.log(sayHello2(user2));
```

此时，编译器会报错 `Argument of type 'number[]' is not assignable to parameter of type 'string'.` 。

虽然编译器报错，但是在 `outDir` 文件夹中仍正常生成了编译后的文件。如果我们想要在编译错误时不生成文件，则需要在 `tsconfig.json` 中添加 `"noEmitOnError": true` 。

在项目中，我们一般会对传入参数进行校验，避免因参数错误造成程序崩溃，为此我们将 `sayHello2` 修改为下面的形式。

```ts
function sayHello2(person: string) {
    if (typeof person === 'string') {
        return 'Hello, ' + person;
    } else {
        throw new Error('person is not a string');
    }
}

let user2 = 'Tom';
console.log(sayHello2(user2));
```

此时文件可以正常编译通过并运行。

```shell
PS C:/demo> tsc
PS C:/demo> node dist/hello.js
Hello World!
Hello, Tom
Hello, Tom
```

## TypeScript函数类型
> 在 JavaScript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）

一个函数有输入类型和输出类型，要在 TypeScript 中对其进行约束，需要把输入和输出都考虑到。

- JavaScript 中的函数定义、

```js
// 函数声明（Function Declaration）
function sum(x, y) {
  return x + y;
}

// 函数表达式（Function Expression）
let mySum = function (x, y) {
  return x + y;
};

// ES6 箭头函数
let mySum2 = (x, y) => {
  return x + y;
}
```

- TypeScript 中的函数定义

```ts
function sum(x: number, y: number): number {
  return x + y;
}

let mysum: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y;
}

let mysum2: (x: number, y: number) => number = (x: number, y: number): number => {
  return x + y;
}
```

> Tips: 这里需要注意一点，TypeScript的 `=>` 和ES6 中的 `=>` 具有不用的意义。TypeScript 中 `=>` 用来表示函数的定义，左边为输入类型，右边为输出类型。ES6 中 `=>` 被称为箭头函数，可以参考 [ES6 中的箭头函数](http://es6.ruanyifeng.com/#docs/function#%E7%AE%AD%E5%A4%B4%E5%87%BD%E6%95%B0)。

上边的代码中 `(x: number, y: number) => number` 为一个整体，跟在 `:` 后面，用来修饰前面的变量。指定了该函数的输入值类型和输出值类型。

- TypeScript 中的函数重载
> 重载函数：在相同的声明域中的函数名相同的，而参数表不同的，即通过函数的参数表而唯一标识并且来区分函数的一种特殊的函数。

例如，我们要实现一个函数 `reverse` , 目的是将输入的参数倒序输出。

```ts
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  } else {
    throw new Error('parameter is not number or string');
  }
}
```
> Tips: `number | string` 此处为 TypeScript 联合类型，表示允许的类型是 `number` 或 `string` ，不能是其他类型。

上面的代码会出现一个问题，不能精确的表达函数的意义，输入为数字是，输出也为数字，输入为字符串时，输出也为字符串。

这时我们可以重载定义多个 `reverse` 的函数类型。

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  } else {
    throw new Error('parameter is not number or string');
  }
}
```
我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示(+1 overload)。

> Tips: TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

## 参考
- [本文相关示例 github](https://github.com/tianyu666/typescript-demo)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)（[中文版](https://zhongsp.gitbooks.io/typescript-handbook/content/doc/handbook/tsconfig.json.html)）
- [TypeScript 入门教程](https://ts.xcatliu.com/introduction/what-is-typescript.html)
- [ESLint](https://eslint.org/)


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
