---
categories:
  - 开发者手册
tags:
  - TypeScript
  - Node.js
---

# 从零开始的Node.js (01) - 初识TypeScript

- Demo: [https://github.com/tianyu666/typescript-demo](https://github.com/tianyu666/typescript-demo)

## 什么是TypeScript？
> TypeScript 就是 Typed JavaScript 。和字面意思一样。TypeScript 就是带类型系统的 JavaScript。

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

## TypeScript的类型系统
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

下面，我们将 `sayHello2` 修改为下面的形式

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
