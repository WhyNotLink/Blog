---
layout: post

title: Git使用指南

date: 2026-04-9

category: [Other]

mermaid: true
---
* TOC
{:toc}
---

# 第一次使用前准备

注册github账号

创建一个仓库

## 绑定基本信息

```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 绑定远程仓库

```
git remote add origin https://gitee.com/***/aa.git
```

## 查看本地仓库关联的远程仓库地址

```
git remote -v
```

## 创建密钥

```
ssh-keygen -t rsa -b 4096 -C "你的邮箱@xxx.com"
```

然后去文件夹.ssh找

## 查看远程仓库里有哪些分支

```
git branch -r
```



# Git

```
git init
git add README.md
git remote add origin sample.git
git add .
git commit -m "first commit"
git push origin master//第二次push可以直接git push

//删除文件
git rm 文件名   也可以直接右键删除
git commit -m "删除无用文件"
git push
```

# Fork

```
git clone https://gitee.com/自己/项目名.git
```

## 创建新分支修改代码

git checkout -b fix-bug

- `git checkout`：Git 用来**切换分支**的基础命令

- ` -b`：**create branch（创建分支）** 的缩写

- `fix-bug`：新分支起的**名字**（可以随便改，比如：login、feature、dev 都行）

## 提交并推送到自己的远程仓库

```
git add .
git commit -m "修复了XX问题" 
git push origin fix-bug
```

## 提交 Pull Request (PR) / 合并请求

回到他的仓库页面
点击 Create Pull Request
选择把他的 fix-bug 分支合并到你的原项目主分支

# 回退

```
git reset --hard <>//强制回退
git checkout//临时查看
git revert //保留回退记录
```

