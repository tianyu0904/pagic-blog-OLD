---
categories:
  - 开发者手册
tags:
  - Linux
  - Ubuntu
  - Node.js
---

<div style='display: none'>
2021-03-30 23:31:56 基本配置 Git SSH VIM
2021-03-30 23:56:21 Nginx安装
2021-03-31 02:34:44 Nginx反向代理 Nginx基本命令
2021-03-31 10:39:55 NodeJS Npm 安装
</div>

# Linux 服务器初始化过程（Node.js）
> 本教程基于Ubuntu 20.04 64位操作系统

在日常的网站开发中，我们或多或少都会和Linux系统打交道。

本篇文章记录了从系统初始化到生产环境配置的全过程，既是备忘也可以作为大家在初次使用Linux服务器时的教程。

## 基本配置

- ROOT 用户登录
> root一般存在于UNIX系统和类UNIX系统中，是系统中唯一的超级用户，具有系统中所有的权限，如启动或停止一个进程，删除或增加用户，增加或者禁用硬件等等。

首先打开终端（此处推荐Xshell），使用root用户登录远程主机（假设IP地址：122.199.188.177）。IP地址和root密码请从服务器供应商获得。

```shell
$ ssh root@122.199.188.177:22
```

这时，命令行会出现警告，表示这是一个新的地址，存在安全风险。键入yes(或者点击接受并保存)，表示接受。然后就应该可以顺利登入远程主机。

```shell
$ passwd
```

如果需要修改root账户密码，请使用上面的命令。

- 新建用户

添加一个用户组（暂定admin）

```shell
$ addgroup admin
```

添加一个新用户（暂定tom）

```shell
$ useradd -d /home/tom -s /bin/bash -m tom
```

上面的命令中，参数 `-d` 指定了用户的主目录，参数 `-s` 指定了用户的shell. 参数 `-m` 表示如果该目录不存在，则创建目录。

设置新用户的密码

```shell
$ passwd tom
```

将新用户（tom）添加到用户组（admin）

```shell
$ usermod -a -G admin tom
```

为新用户（tom）设定sudo权限

```shell
$ visudo
```

`visudo` 命令会打开sudo配置文件`/etc/sudoers`，找到下面第一行，然后在其下方添加第二行。按`Ctrl-X`退出，输入Y，回车键保存。
> Tips: 如果提示找不到`sudo`，需要手动安装。`spt-get install sudo`。

```shell
root    ALL=(ALL:ALL) ALL

tom     ALL=(ALL:ALL) ALL
```

退出root用户，使用新用户登录

```shell
$ exit
$ ssh tom@122.199.188.177
```

## git 和 SSH配置

首先，使用`ssh-keygen`命令生成SSH公钥。

```shell
$ ssh-keygen

$ cat .ssh/id_rsa.pub
```

第一条命令用于生成SSH公钥。按照提示一路回车就可以。

第二条命令用于打印SSH公钥。将输出的公钥填入git的SSH keys。

> tips: 添加了公钥，Git才会允许该主机操作远程仓库。

更新软件

```shell
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install git
$ sudo apt install lrzsz
$ sudo apt install tmux
$ sudo apt install zip unzip
```

配置Git用户信息

```shell
git config --global user.name "tom"
git config --global user.email "tom@gmail.com"
```

## 个性化设置
> 相比你也觉得全黑白的命令行略显枯燥吧，下面的命令可以试命令行和VIM变得更加多彩。

由于审美和习惯的不同，每个人的配色方案也各有差别。下面分享一下我自己在用的配置。

- 终端美化

打开Shell配置文件。

```shell
$ cd
$ vim .bashrc
```

在文件末尾添加如下参数。

```shell
# DIY $PS1
function color_my_love () {
    local __color_black="\[\e[30;0m\]"
    local __color_black_light="\[\e[30;1m\]"
    local __color_red="\[\e[31;0m\]"
    local __color_red_light="\[\e[31;1m\]"
    local __color_green="\[\e[32;0m\]"
    local __color_green_light="\[\e[32;1m\]"
    local __color_yellow="\[\e[33;0m\]"
    local __color_yellow_light="\[\e[33;1m\]"
    local __color_blue="\[\e[34;0m\]"
    local __color_blue_light="\[\e[34;1m\]"
    local __color_pink="\[\e[35;0m\]"
    local __color_pink_light="\[\e[35;1m\]"
    local __color_cyan="\[\e[36;0m\]"
    local __color_cyan_light="\[\e[36;1m\]"
    local __color_white="\[\e[37;0m\]"
    local __color_white_light="\[\e[37;1m\]"
    
    local __color_end="\[\e[0m\]"

    PS1="$__color_yellow_light\u$__color_red_light@$__color_yellow_light\h$__color_red_light:$__color_green_light\w$__color_blue_light$ $__color_white_light"
}
color_my_love
```

- VIM美化

配色方案地址：[http://vimcolors.com/](http://vimcolors.com/) 大家可以挑选自己喜欢的配色方案，然后替换下面命令中的URL。

```shell
$ git clone https://github.com/gryf/wombat256grf.git ~/.vim

$ vim .vimrc
```

打开 vim 配置文件 `.vimrc` 输入以下代码。

```shell
"设置行号"
set number

"配置状态栏"
set statusline=%F%m%r%h%w\ [FORMAT=%{&ff}]\ [TYPE=%Y]\ [ASCII=\%03.3b]\ [HEX=\%02.2B]\ [POS=%04l,%04v][%p%%]\ [LEN=%L]
set laststatus=2

"选择配色方案" 此处方案名称按上面选定的链接设置
colorscheme wombat256grf
```

## Nginx 安装和配置
> Nginx(engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。

- Nginx 安装

输入以下命令安装Nginx

```shell
$ sudo apt-get install nginx
```

输入以下命令检测Nginx是否安装成功

```shell
$ sudo nginx -t
```

- Nginx 设置

```shell
$ cd /etc/nginx
$ sudo mkdir include
$ sudo mkdir certs
$ sudo vim nginx.conf
```

上面的命令打开了nginx文件夹，并打开了nginx配置文件。在文件中 `http` 区块内添加如下配置。

```shell
# self config
include /etc/nginx/include/*.conf;
```

> tips: include 文件夹存放个人配置文件，建议使用域名作为配置文件的文件名。

> tips: certs 文件夹存放证书文件。

- 反向代理

下面是一个 https 的反向代理，将访问本台服务器的http链接根据域名匹配规则代理到本机指定端口的服务。

```shell
server {
    listen 443 ssl;
    server_name $host;
    # ssl on;
    ssl_certificate certs/$host.crt;
    ssl_certificate_key certs/$host.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;
    location / {
      proxy_pass http://127.0.0.1:40000;
    }
}
```

- 基本命令

下面是常见的几个Nginx命令。

```shell
# 验证配置文件是否正确
sudo nginx -t

# 启动nginx
sudo nginx

# 重启nginx
sudo nginx -s reload

# 关闭nginx
sudo nginx -s stop
```

## Node.js 安装和配置
> Node.js 是一个基于Chrome V8引擎的JavaScript运行环境，使用了一个事件驱动、非阻塞式I/O模型。

> Npm 的全称是Node Package Manager，是一个NodeJS包管理和分发工具.

使用下面命令安装 `nodejs` 和 `npm`

```shell
$ sudo apt install nodejs
$ sudo apt install npm
```

安装完成后可以使用下面的命令查看安装版本

```shell
$ node --version
$ npm -v
```
Ubuntu 20.04 apt 内置的`Node`版本是`v10.19.0`。`Npm`版本是`6.14.4`。

如果需要其他版本的Node，可以使用node.js 版本管理工具 `n`。

## 使用 pm2 部署项目
