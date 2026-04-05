---
layout: post

title: 前端开发

date: 2026-04-5

category: [Web]

mermaid: true

---
* TOC
{:toc}
---

# 一、HTML（超文本标记语言）—— 页面结构骨架

核心作用：定义网页的结构和内容，告诉浏览器“显示什么”，不负责样式和交互，所有标签遵循“闭合原则”（单标签除外），标签不区分大小写，但推荐小写。

## 1.1 基础结构

```html
&lt;!DOCTYPE html&gt; <!-- 声明文档类型为HTML5，必须放在第一行 -->
&lt;html lang="zh-CN"&gt; <!-- 根标签，lang指定语言（zh-CN为中文） -->
  <head> <!-- 头部：存放页面元信息，不直接显示在页面上 -->
    &lt;meta charset="UTF-8"&gt; <!-- 字符编码，必须设置，避免中文乱码 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"&gt; <!-- 适配移动端，关键配置 -->
    <title>页面标题&lt;/title&gt; <!-- 浏览器标签页标题 -->
    &lt;link rel="stylesheet" href="css文件路径"&gt; <!-- 引入外部CSS文件 -->
    &lt;script src="js文件路径"&gt;&lt;/script&gt; <!-- 引入外部JS文件 -->
  &lt;/head&gt;
  &lt;body&gt; <!-- 主体：页面所有可见内容都放在这里 -->
    页面内容（文本、图片、按钮等）
  </body>
</html>
```

## 1.2 核心标签分类

### 1.2.1 语义化标签（利于SEO和可读性）

语义化标签本质是“有含义的标签”，替代传统的div，让结构更清晰，搜索引擎能更好识别内容。

| 标签           | 作用说明                                               |
| -------------- | ------------------------------------------------------ |
| `<header>`     | 页面或区域头部，可放导航栏、标题等，一个页面可多次使用 |
| `<nav>`        | 导航栏区域，专门存放页面跳转链接                       |
| `<main>`       | 页面主体内容，**一个页面只能有一个**                   |
| `<section>`    | 内容区块，用于划分不同主题的内容（章节、产品列表等）   |
| `<article>`    | 独立完整内容（新闻、博客、评论），可独立存在           |
| `<aside>`      | 侧边栏，用于广告、作者信息、相关推荐等附属内容         |
| `<footer>`     | 页面或区域底部，放版权信息、联系方式等                 |
| `<figure>`     | 用于包裹图片、图表等，配合 `<figcaption>` 使用         |
| `<figcaption>` | 图片 / 图表的标题或说明文字，放在 `<figure>` 内部      |

### 1.2.2 文本标签

| 标签          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| `<h1> ~ <h6>` | 标题标签，h1 级别最高（一页建议 1 个），h6 最低；自带加粗、换行 |
| `<p>`         | 段落标签，自动换行，段落间有默认间距                         |
| `<span>`      | 行内文本标签，无默认样式，用于包裹局部文本（如高亮）         |
| `<strong>`    | 加粗文本，语义表示重要，比 `<b>` 更推荐                      |
| `<em>`        | 斜体文本，语义表示语气强调，比 `<i>` 更推荐                  |
| `<del>`       | 删除线文本，常用于商品原价                                   |
| `<ins>`       | 下划线文本，常用于商品现价                                   |
| `<br/>`       | 强制换行，单标签，区别于段落换行                             |
| `<hr/>`       | 水平分隔线，单标签，用于内容区块分隔                         |

### 1.2.3 图片与链接标签

#### 图片标签：```<img>```（单标签，核心用于展示图片）

```html
<img src="图片路径" alt="图片加载失败时的提示文本" title="鼠标悬浮时的提示文本" width="宽度" height="高度">
```

- src：必选属性，指定图片路径（绝对路径：如https://xxx.jpg；相对路径：如./img/1.jpg）
- alt：必选属性，提升可访问性，图片加载失败时显示，搜索引擎也会识别
- width/height：可选，设置图片尺寸，只设置一个，另一个会自动等比例缩放（避免图片变形）

#### 链接标签：```<a>```（双标签，核心用于页面跳转）

```html
<a href="跳转目标" target="打开方式" title="悬浮提示">链接文本/图片</a>
```

- href：必选属性，跳转目标（可以是网页地址、本地文件路径、锚点、邮件地址）
- target：可选，设置打开方式        
  - _self：默认值，在当前窗口打开
  - _blank：在新窗口打开（推荐跳转外部链接时使用）
  - _parent：在父框架打开
  - _top：在整个窗口打开，取消框架
- 锚点跳转：href="#id值"，跳转到当前页面中id为该值的标签（如<a href="#section1">跳转到章节1</a>，对应```<section id="section1">```）
- 特殊跳转：mailto:邮箱地址（打开邮件客户端）、tel:手机号（打开拨号界面）

### 1.2.4 列表标签

- 无序列表```<ul>```：默认列表项前有圆点 

```
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
</ul>
```

- 有序列表：```<ol> ```，默认列表项前有数字，可通过type属性设置序号类型（1、a、A、i、I） 

```
<ol type="a">
  <li>第一步</li>
  <li>第二步</li>
</ol>
```

- 自定义列表：```<dl>```,```<dt>```（列表标题）和 ```<dd>```（列表描述），常用于展示名词+解释       

```
<dl>
  <dt>HTML</dt>
  <dd>超文本标记语言，用于定义页面结构</dd>
  <dt>CSS</dt>
  <dd>层叠样式表，用于美化页面</dd>
</dl>
```

### 1.2.5 表单标签（用于收集用户输入）

核心标签：```<form>```（表单容器），所有表单元素必须放在form内，用于提交数据到后端。

```html
<form action="后端接口地址" method="提交方式" enctype="数据编码方式"&gt;
  <!-- 表单元素 -->
</form>
```

- action：必选，指定表单数据提交到的后端接口地址
- method：可选，提交方式（get：默认，数据拼接在URL上，不安全，适合少量数据；post：数据隐藏提交，安全，适合大量/敏感数据）
- enctype：可选，数据编码方式（默认application/x-www-form-urlencoded；上传文件时需设为multipart/form-data）

#### 常用表单元素

- 输入框：```<input>```（单标签，通过type属性控制输入类型）    

```
<input type="text" name="username" placeholder="请输入用户名" value="默认值" required maxlength="20">
```

| type常用值 | 说明                                     |
| :--------- | :--------------------------------------- |
| text       | 普通文本输入框                           |
| password   | 密码输入框，输入内容会隐藏               |
| number     | 数字输入框，仅允许输入数字               |
| tel        | 手机号输入框，适配移动端拨号键盘         |
| email      | 邮箱输入框，会自动校验邮箱格式           |
| radio      | 单选按钮，多个同name值互斥，仅能选择一个 |
| checkbox   | 复选按钮，多个同name值可多选             |
| file       | 文件上传按钮，用于选择本地文件           |
| button     | 普通按钮，需配合JS绑定事件实现功能       |
| submit     | 提交按钮，点击可提交表单数据             |
| reset      | 重置按钮，点击可重置表单内所有输入内容   |

| 核心属性    | 说明                                             |
| :---------- | :----------------------------------------------- |
| name        | 表单元素名称，后端接收数据的key，为必填项        |
| placeholder | 输入提示文本，引导用户输入正确内容               |
| value       | 表单元素的默认值，用户可修改（readonly状态除外） |
| required    | 必填项标识，未填写时无法提交表单                 |
| maxlength   | 限制输入内容的最大长度                           |
| disabled    | 禁用状态，元素无法编辑，提交表单时不传递该数据   |
| readonly    | 只读状态，元素无法编辑，但提交表单时会传递该数据 |

- 下拉框：```<select>``` ，默认单选，添加multiple属性可多选        

```
<select name="city">
  <option value="" disabled selected>请选择城市&lt;/option&gt; <!-- 默认提示项，不可选 -->
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
</select>
```

- 文本域：```<textarea>```（多行文本输入，如备注、留言）      

```
<textarea name="remark" rows="5" cols="30" placeholder="请输入备注">默认文本</textarea>
```

| 属性 | 说明                            |
| :--- | :------------------------------ |
| rows | 默认显示行数，可通过CSS调整大小 |
| cols | 默认显示列数，可通过CSS调整大小 |

- 按钮：```<button>```（双标签，比input按钮更灵活，可嵌套文本、图片）       

```
<button type="submit">提交</button>
<button type="reset">重置</button>
<button type="button">普通按钮</button>
```

- 表单分组：```<fieldset>```，```<legend> ```定义分组标题  

```
<fieldset>
  <legend>用户信息</legend>
  <input type="text" name="username" placeholder="用户名">
  <input type="password" name="password" placeholder="密码">
</fieldset>
```

### 1.2.6 HTML5 新特性

- 语义化标签：如header、nav、main、section等（前面已详细说明）

- 多媒体标签：        

  1、```<audio>：播放音频，支持mp3、wav、ogg格式 ```

```
<audio src="音频路径" controls autoplay loop>您的浏览器不支持音频播放</audio>
```

| 属性名   | 说明                                  |
| :------- | :------------------------------------ |
| controls | 显示播放控件                          |
| autoplay | 自动播放（部分浏览器需配合muted静音） |
| loop     | 循环播放                              |
| poster   | 视频加载前显示的封面图片              |

​	2、```<video>：播放视频，支持mp4、webm、ogg格式```

```
<video src="视频路径" controls width="600" poster="视频封面图片路径">您的浏览器不支持视频播放</video>
```

- Web 存储：        
  - localStorage：本地存储，永久保存（除非手动删除），容量约5MB，字符串格式，适合存储不敏感的长期数据（如用户偏好设置）
  - sessionStorage：会话存储，关闭浏览器窗口后数据丢失，容量约5MB，适合存储临时数据（如表单临时输入内容）

用法示例：

```
localStorage.setItem("username", "zhangsan")（存）
localStorage.getItem("username")（取）
localStorage.removeItem("username")（删）
```

- Canvas：画布标签，用于绘制图形、动画、游戏等，需配合JavaScript使用（如绘制矩形、圆形、文字）
- SVG：矢量图形标签，绘制的图形放大后不会模糊（如图标、图表），可直接通过标签编辑，也可配合CSS美化
- 表单新类型：email、tel、number、date、time、color等，自带基础校验和输入提示

### 1.3 常用属性与规范

- id：唯一标识，一个页面中id不能重复，用于锚点跳转、JS获取元素
- class：类名，用于CSS样式复用，一个元素可多个class（用空格分隔）
- title：鼠标悬浮时显示的提示文本，几乎所有标签都可使用
- 规范：标签嵌套要合理（如块级标签可嵌套行内标签，p标签不能嵌套div、h1等块级标签）；属性值必须加引号（单引号、双引号均可，推荐双引号）

# 二、CSS（层叠样式表）—— 页面样式与布局

核心作用：控制HTML元素的样式（颜色、大小、位置、间距等），实现页面美化，支持“层叠”（多个样式叠加）、“继承”（子元素继承父元素部分样式）、“优先级”（解决样式冲突）。

## 2.1 CSS 引入方式（3种，按优先级从高到低）

### 2.1.1 内联样式（行内样式）

直接在HTML标签内通过style属性写CSS，仅作用于当前标签，优先级最高，不利于样式复用。

```html
<div style="width: 100px; height: 100px; background-color: red;"></div>
```

### 2.1.2 内部样式（嵌入样式）

在HTML的head标签内，通过```<style>```标签写CSS，作用于当前整个页面，优先级次之。

```html
<head>
  <style>
    div {
      width: 100px;
      height: 100px;
      background-color: red;
    }
  </style>
</head>
```

### 2.1.3 外部样式（链接样式）

创建独立的.css文件，通过```<link>```标签引入HTML，作用于多个页面，优先级最低，最推荐使用（利于样式复用和维护）。

```html
// HTML中引入
<link rel="stylesheet" href="./css/style.css">

// style.css文件中
div {
  width: 100px;
  height: 100px;
  background-color: red;
}
```

## 2.2 选择器（找到要样式化的HTML元素）

选择器的核心是“匹配元素”，不同选择器有不同优先级，优先级高的样式会覆盖优先级低的样式。

### 2.2.1 基础选择器

| 选择器       | 语法   | 说明                                 | 示例                                                   |
| :----------- | :----- | :----------------------------------- | :----------------------------------------------------- |
| 元素选择器   | 标签名 | 匹配所有该标签的元素                 | div { ... }（匹配所有div）                             |
| 类选择器     | .类名  | 匹配所有class为该值的元素，可复用    | .box { ... }（匹配所有class="box"的元素）              |
| id选择器     | #id值  | 匹配id为该值的唯一元素，不可复用     | #header { ... }（匹配id="header"的元素）               |
| 通配符选择器 | *      | 匹配页面所有元素，常用于重置默认样式 | * { margin: 0; padding: 0; }（清除所有元素的默认边距） |

### 2.2.2 组合选择器

| 选择器         | 语法                     | 说明                                              | 示例                                             |
| :------------- | :----------------------- | :------------------------------------------------ | :----------------------------------------------- |
| 后代选择器     | 选择器1 选择器2          | 匹配选择器1的所有后代元素（包括子、孙、曾孙等）   | .box p { ... }（匹配class="box"内的所有p标签）   |
| 子选择器       | 选择器1 > 选择器2        | 匹配选择器1的直接子元素（仅子级，不包括孙级）     | .box > p { ... }（匹配class="box"的直接子元素p） |
| 相邻兄弟选择器 | 选择器1 + 选择器2        | 匹配选择器1后面紧邻的第一个同级元素（必须同父级） | div + p { ... }（匹配div后面紧邻的第一个p标签）  |
| 通用兄弟选择器 | 选择器1 ~ 选择器2        | 匹配选择器1后面所有同级元素（必须同父级）         | div ~ p { ... }（匹配div后面所有的p标签）        |
| 交集选择器     | 选择器1选择器2（无空格） | 同时满足两个选择器的元素                          | div.box { ... }（匹配class="box"的div标签）      |
| 并集选择器     | 选择器1, 选择器2         | 匹配所有满足其中一个选择器的元素                  | div, p, span { ... }（匹配所有div、p、span标签） |

### 2.2.3 伪类选择器（用于元素的特殊状态）

伪类以“:”开头，用于描述元素的状态（如hover、active）或位置（如first-child）。

- 链接伪类（按顺序书写：link → visited → hover → active）        
  - a:link：未访问过的链接
  - a:visited：已访问过的链接
  - a:hover：鼠标悬浮在链接上的状态（最常用）
  - a:active：鼠标点击链接时的状态（按下未松开）
- 表单伪类
  - input:focus：输入框获取焦点时的状态（如点击输入框后边框变色）
  - input:checked：单选/复选按钮被选中时的状态
  - input:disabled：输入框被禁用时的状态
  - input:required：必填项输入框的状态
- 结构伪类（匹配元素的位置）        
  - li:first-child：匹配第一个li元素
  - li:last-child：匹配最后一个li元素
  - li:nth-child(n)：匹配第n个li元素（n为数字，可写even偶数、odd奇数）
  - li:nth-of-type(n)：匹配同类型元素中的第n个（区别于nth-child，只看同类型）
- 其他常用伪类：```:hover```（所有元素都可使用，如```div:hover```）、```:not```(选择器)（排除指定选择器的元素，如```div:not(.box)```）

### 2.2.4 伪元素选择器（用于创建虚拟元素）

伪元素以“::”开头，用于在元素内部添加虚拟内容（如before、after），需配合content属性使用。

- ::before：在元素内容的前面添加虚拟元素
- ::after：在元素内容的后面添加虚拟元素
- ::first-letter：匹配文本的第一个字母
- ::first-line：匹配文本的第一行

```css
.box::before {
  content: ""; /* 必写，可空值 */
  display: block;
  width: 20px;
  height: 20px;
  background-color: blue;
}
```

### 2.2.5 选择器优先级（解决样式冲突）

优先级规则： specificity（ specificity 值越高，优先级越高），计算方式如下（从高到低）：

1. 内联样式（style属性）：specificity = 1000
2. id选择器：specificity = 100
3. 类选择器、伪类选择器、属性选择器：specificity = 10
4. 元素选择器、伪元素选择器：specificity = 1
5. 通配符选择器：specificity = 0

补充：!important 可强制提升样式优先级（最高），但不推荐滥用（会破坏优先级规则，难以维护），用法：属性值后加 !important（如 ```color: red !important;```）。

## 2.3 核心样式属性

### 2.3.1 盒模型（所有元素都有盒模型）

盒模型组成（从内到外）：content（内容区）→ padding（内边距）→ border（边框）→ margin（外边距），决定元素的实际大小。

- content：元素的内容（文本、图片等），宽度和高度由width、height属性控制
- padding：内边距，内容区与边框之间的距离，不影响元素外部空间，会增加元素实际大小

| 写法     | 代码示例                                                   | 含义说明（顺时针：上 → 右 → 下 → 左）              |
| -------- | ---------------------------------------------------------- | -------------------------------------------------- |
| 1 个值   | `padding: 10px;`                                           | 四个方向**内边距都相同**：上 = 右 = 下 = 左 = 10px |
| 2 个值   | `padding: 10px 20px;`                                      | **上下 10px，左右 20px**                           |
| 3 个值   | `padding: 10px 20px 30px;`                                 | **上 10px，左右 20px，下 30px**                    |
| 4 个值   | `padding: 10px 20px 30px 40px;`                            | **上 → 右 → 下 → 左**（顺时针顺序）                |
| 单独方向 | `padding-top``padding-right``padding-bottom``padding-left` | 单独设置某一个方向的内边距例：`padding-top: 10px;` |

- border：边框，内边距与外边距之间的线条，会增加元素实际大小

  | 属性 / 写法  | 代码示例                     | 作用说明                                                     |
  | ------------ | ---------------------------- | ------------------------------------------------------------ |
  | **边框简写** | `border: 1px solid red;`     | **三合一写法**：宽度 (1px) + 样式 (solid) + 颜色 (red)，**三个值缺一不可** |
  | 单独 - 宽度  | `border-width: 1px;`         | 设置边框粗细                                                 |
  | 单独 - 样式  | `border-style: solid;`       | 设置边框线型：`solid`实线 / `dashed`虚线 / `dotted`点线      |
  | 单独 - 颜色  | `border-color: red;`         | 设置边框颜色                                                 |
  | 单方向边框   | `border-top: 1px solid red;` | 单独设置某一边：上 (`top`)、右 (`right`)、下 (`bottom`)、左 (`left`) |
  | 边框圆角     | `border-radius: 5px;`        | 圆角大小，数值越大越圆                                       |
  | 正圆效果     | `border-radius: 50%;`        | **必须配合宽高相等**的元素使用                               |

- margin：外边距，元素与其他元素之间的距离，不影响元素自身大小，会影响元素在页面中的位置

  | 写法       | 代码示例                                               | 含义说明                                      |
  | ---------- | ------------------------------------------------------ | --------------------------------------------- |
  | 1 个值     | `margin: 10px;`                                        | 上、右、下、左四个方向外边距均为 10px         |
  | 2 个值     | `margin: 10px 20px;`                                   | 上下 10px，左右 20px                          |
  | 3 个值     | `margin: 10px 20px 30px;`                              | 上 10px，左右 20px，下 30px                   |
  | 4 个值     | `margin: 10px 20px 30px 40px;`                         | 上 → 右 → 下 → 左（顺时针）                   |
  | 居中常用   | `margin: 10px auto;`                                   | 上下 10px，左右自动水平居中（仅块级元素生效） |
  | 单方向设置 | `margin-top``margin-right``margin-bottom``margin-left` | 单独控制某一方向的外边距                      |

注意：margin存在“塌陷”问题（相邻两个块级元素的上下margin会重叠，取较大值），解决方法：给父元素添加```border```、```padding```，或使用```overflow: hidden```。

- 盒模型模式：        
  - 标准盒模型（默认）：```box-sizing: content-box; ```元素实际宽度 = width + padding + border
  - 怪异盒模型（推荐）：```box-sizing: border-box; ```元素实际宽度 = width（包含content、padding、border），无需手动计算，更方便布局

### 2.3.2 字体与文本样式

#### 字体样式

```css
font-family: "微软雅黑", "宋体", sans-serif; /* 字体族，多个字体用逗号分隔，兜底sans-serif（无衬线字体） */
font-size: 16px; /* 字体大小，默认16px，常用单位px（固定）、rem（相对根元素） */
font-weight: 400; /* 字体粗细，400=正常（normal），700=加粗（bold），100-900可选 */
font-style: normal; /* 字体样式，normal=正常，italic=斜体 */
font: italic 700 16px "微软雅黑", sans-serif; /* 字体复合属性，顺序：style → weight → size → family（必须包含size和family） */
```

#### 文本样式

```css
color: red; /* 文本颜色，支持十六进制（#ff0000）、rgb（rgb(255,0,0)）、rgba（rgba(255,0,0,0.5)，最后一个值是透明度0-1） */
text-align: left; /* 文本对齐方式，left=左对齐（默认）、center=居中、right=右对齐、justify=两端对齐 */
text-decoration: none; /* 文本装饰，none=无装饰（清除链接下划线）、underline=下划线、line-through=删除线、overline=上划线 */
text-indent: 2em; /* 首行缩进，2em=两个字符（em是相对当前字体大小） */
line-height: 1.5; /* 行高，单位可省略（相对于字体大小），line-height=height可实现文本垂直居中 */
letter-spacing: 2px; /* 字间距，控制字符之间的距离 */
word-spacing: 5px; /* 词间距，控制单词之间的距离（英文有效） */
text-transform: none; /* 文本大小写，none=默认、uppercase=全大写、lowercase=全小写、capitalize=首字母大写（英文有效） */
```

### 2.3.3 背景样式

```css
background-color: #f5f5f5; /* 背景颜色，与text-color取值一致 */
background-image: url("图片路径"); /* 背景图片 */
background-repeat: no-repeat; /* 背景图片重复方式，no-repeat=不重复（默认repeat=重复）、repeat-x=水平重复、repeat-y=垂直重复 */
background-position: center; /* 背景图片位置，可写方位词（center、left、top等）或像素值（background-position: 50px 50px; 水平50px，垂直50px） */
background-size: cover; /* 背景图片大小，cover=覆盖整个容器（可能裁剪）、contain=完整显示图片（可能留空白）、具体尺寸（如100px 100px） */
background-attachment: fixed; /* 背景图片固定，滚动页面时背景不移动（默认scroll=跟随滚动） */
/* 背景复合属性，顺序无严格要求，但推荐：color → image → repeat → position → size → attachment */
background: #f5f5f5 url("图片路径") no-repeat center cover fixed;
```

补充：背景渐变（CSS3新特性）：

```css
/* 线性渐变：从左到右，红色到蓝色 */
background: linear-gradient(to right, red, blue);
/* 径向渐变：从中心向外，红色到蓝色 */
background: radial-gradient(red, blue);
```

### 2.3.4 元素显示与定位

#### 元素显示模式（display属性）

元素默认分为块级元素、行内元素、行内块元素，可通过display属性切换。

| 显示模式   | display值    | 特点                                                         | 示例元素                                     |
| :--------- | :----------- | :----------------------------------------------------------- | :------------------------------------------- |
| 块级元素   | block        | 独占一行；可设置width、height、margin、padding；默认宽度100%（父元素宽度） | div、h1-h6、p、ul、ol、li、section、header等 |
| 行内元素   | inline       | 不独占一行；不可设置width、height；margin和padding仅左右有效，上下无效 | span、a、strong、em、del等                   |
| 行内块元素 | inline-block | 不独占一行；可设置width、height、margin、padding；兼具行内和块级元素特点 | input、img、button等                         |

补充：```display: none```; 隐藏元素，元素不显示，且不占据页面空间（区别于```visibility: hidden```; 隐藏元素但占据空间）。

#### 定位（position属性，核心布局方式）

定位用于精确控制元素在页面中的位置，定位元素会脱离正常文档流（除static外）。

| 定位方式 | position值 | 特点                                                         | 定位基准           | 常用场景                           |
| :------- | :--------- | :----------------------------------------------------------- | :----------------- | :--------------------------------- |
| 静态定位 | static     | 默认值，不脱离文档流，无法使用top、right、bottom、left定位   | 无                 | 默认布局                           |
| 相对定位 | relative   | 不脱离文档流，元素位置相对自身原来的位置偏移，保留原来的空间 | 自身原来的位置     | 作为绝对定位的父容器；微调元素位置 |
| 绝对定位 | absolute   | 脱离文档流，不保留原来的空间，位置相对于最近的已定位父元素（relative/absolute/fixed），若无则相对于body | 最近的已定位父元素 | 弹窗、下拉菜单、元素悬浮           |
| 固定定位 | fixed      | 脱离文档流，不保留原来的空间，位置相对于浏览器窗口，滚动页面时位置不变 | 浏览器窗口         | 导航栏固定、回到顶部按钮           |
| 粘性定位 | sticky     | 未滚动到指定位置时是static，滚动到指定位置后变成fixed，保留原来的空间 | 浏览器窗口+父元素  | 滚动时固定的标题、侧边栏           |

补充：定位偏移属性（top、right、bottom、left），用于控制定位元素的具体位置，单位常用px、%。

### 2.3.5 浮动（float属性，传统布局方式）

浮动用于让元素脱离正常文档流，向左或向右浮动，围绕浮动元素的内容会自动环绕，常用于传统的多列布局。

```css
float: left; /* 向左浮动 */
float: right; /* 向右浮动 */
float: none; /* 默认值，不浮动 */
```

注意：浮动会导致“父元素塌陷”（父元素高度为0，因为浮动元素脱离文档流），解决方法（清除浮动）：

- 方法1：给父元素添加```overflow: hidden```;
- 方法2：在浮动元素末尾添加一个空的div，设置```clear: both```;
- 方法3：使用伪元素清除浮动（推荐）

```
.parent::after {
  content: "";
  display: block;
  clear: both;
}
```

### 2.3.6 弹性布局（Flex布局，现代布局方式）

Flex布局（弹性布局）是目前最常用的布局方式，简单灵活，适用于各种布局场景（如居中、多列、对齐等），核心是“容器”和“项目”（容器内的子元素）。

#### 1. 开启Flex布局

```css
.container {
  display: flex; /* 给父容器开启Flex布局，子元素自动成为Flex项目 */
  display: inline-flex; /* 行内Flex容器，不独占一行 */
}
```

#### 2. 容器属性（作用于父容器）

- flex-direction：设置主轴方向（项目排列方向）
  - row：默认值，主轴水平向右（项目从左到右排列）
  - row-reverse：主轴水平向左（项目从右到左排列）
  - column：主轴垂直向下（项目从上到下排列）
  - column-reverse：主轴垂直向上（项目从下到上排列）
- flex-wrap：设置项目是否换行        
  - nowrap：默认值，不换行，项目会被压缩
  - wrap：换行，超出容器宽度的项目自动换行
  - wrap-reverse：反向换行，换行后项目从下到上排列
- flex-flow：flex-direction + flex-wrap 的复合属性（如 flex-flow: row wrap;）
- justify-content：设置项目在主轴上的对齐方式（核心，用于水平/垂直居中）        
  - flex-start：默认值，主轴起点对齐
  - flex-end：主轴终点对齐
  - center：主轴居中对齐（常用，如水平居中）
  - space-between：两端对齐，项目之间间距相等
  - space-around：项目两侧间距相等，整体间距是项目之间间距的2倍
  - space-evenly：项目之间、项目与容器边缘间距都相等
- align-items：设置项目在交叉轴上的对齐方式（交叉轴与主轴垂直）        
  - stretch：默认值，项目拉伸至与容器交叉轴高度一致
  - flex-start：交叉轴起点对齐
  - flex-end：交叉轴终点对齐
  - center：交叉轴居中对齐（常用，如垂直居中）
  - baseline：项目按文本基线对齐
- align-content：设置多行项目在交叉轴上的对齐方式（仅当项目换行时有效）

#### 3. 项目属性（作用于子项目）

- flex-grow：项目的放大比例，默认0（不放大），值为数字（无单位），所有项目的flex-grow之和决定放大比例。例如：3个项目flex-grow分别为1、1、2，剩余空间按1:1:2的比例分配给3个项目。
- flex-shrink：项目的缩小比例，默认1（允许缩小），值为数字（无单位），当项目总宽度超出容器时，按flex-shrink比例缩小。值为0时，项目不缩小（固定宽度）。
- flex-basis：项目在主轴上的初始宽度（默认值为auto，即项目自身宽度），可设置具体数值（如100px），优先级高于width属性。
- flex：flex-grow + flex-shrink + flex-basis 的复合属性（推荐使用），默认值为0 1 auto。常用取值：flex: 1; 等价于flex: 1 1 auto（项目自动放大缩小，适应容器）；flex: none; 等价于flex: 0 0 auto（项目固定大小，不放大不缩小）。
- align-self：单独设置某个项目在交叉轴上的对齐方式，覆盖父容器的align-items属性，取值与align-items一致（stretch、flex-start、flex-end、center、baseline），默认值为auto（继承父容器align-items）。
- order：控制项目的排列顺序，默认值为0，数值越小，项目排列越靠前，可设置负数（如order: -1，优先排列）。

### 2.3.7 网格布局（Grid布局，现代布局方式，补充）

Grid布局（网格布局）是比Flex布局更强大的布局方式，适用于二维布局（行+列），可快速实现复杂的多列多行布局，核心同样是“容器”和“项目”。

#### 1. 开启Grid布局

```css
.container {
  display: grid; /* 给父容器开启Grid布局，子元素自动成为Grid项目 */
  display: inline-grid; /* 行内Grid容器，不独占一行 */
}
```

#### 2. 容器属性（作用于父容器）

- grid-template-columns：设置列数和每列宽度（核心）

```
/* 3列，每列宽度分别为100px、200px、300px */
grid-template-columns: 100px 200px 300px;
/* 3列，每列宽度相等，占满容器（常用） */
grid-template-columns: repeat(3, 1fr); /* repeat(重复次数, 宽度)，1fr=等分剩余空间 */
/* 自适应列宽，最小100px，最大自适应 */
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
/* 混合宽度 */
grid-template-columns: 100px auto 1fr;
```

- grid-template-rows：设置行数和每行高度，用法与grid-template-columns一致  

```
 /* 2行，每行高度分别为50px、100px */
grid-template-rows: 50px 100px;
/* 2行，每行高度自适应，占满剩余空间 */
grid-template-rows: repeat(2, 1fr);
```

- grid-gap（别名gap）：设置项目之间的间距（行间距+列间距），无需额外清除间距  

```
gap: 10px; /* 行间距和列间距都是10px */
gap: 10px 20px; /* 行间距10px，列间距20px */
/* 单独设置：row-gap（行间距）、column-gap（列间距） */
```

- grid-template-areas：通过命名区域布局（直观，适合复杂布局）

```
/* 先给容器定义区域 */
.container {
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 100px 300px 100px;
  grid-template-areas:
    "header header"
    "aside main"
    "footer footer";
}
/* 给项目分配区域 */
.header { grid-area: header; }
.aside { grid-area: aside; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

- justify-items：设置项目在单元格内的水平对齐方式（类似Flex的justify-content），取值：stretch（默认）、start、center、end
- align-items：设置项目在单元格内的垂直对齐方式（类似Flex的align-items），取值与justify-items一致

#### 3. 项目属性（作用于子项目）

- grid-column：控制项目占据的列数（列起始位置 + 列结束位置）          

```
/* 从第1列开始，到第3列结束（占据2列） */
grid-column: 1 / 3;
/* 简写：占据2列 */
grid-column: span 2;
```

- grid-row：控制项目占据的行数，用法与grid-column一致

```
/* 从第1行开始，到第2行结束（占据1行） */
grid-row: 1 / 2;
/* 简写：占据2行 */
grid-row: span 2;
```

- grid-area：给项目命名，配合容器的grid-template-areas使用（前文已示例）
- justify-self：单独设置某个项目在单元格内的水平对齐方式，覆盖容器的justify-items
- align-self：单独设置某个项目在单元格内的垂直对齐方式，覆盖容器的align-items

### 2.3.8 CSS3 其他常用新特性

- 过渡（transition）：实现元素样式的平滑变化，避免生硬切换，需配合hover、active等状态使用 

```
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  /* 过渡属性：过渡的样式 过渡时间 过渡速度 延迟时间 */
  transition: width 0.5s ease 0.1s;
}
.box:hover {
  width: 200px; /* 鼠标悬浮时，宽度平滑从100px变为200px */
}
```

​		补充：transition: all 0.5s; 可给所有可过渡样式添加过渡效果（简化写法）。

- 动画（animation）：实现更复杂的动态效果，可自定义关键帧，无需依赖状态触发

```
/* 定义关键帧（动画的各个阶段） */
@keyframes move {
  0% { left: 0; } /* 动画开始状态 */
  50% { left: 200px; background-color: blue; } /* 动画中间状态 */
  100% { left: 400px; } /* 动画结束状态 */
}
.box {
  position: relative;
  width: 100px;
  height: 100px;
  background-color: red;
  /* 动画属性：动画名称 动画时间 动画速度 循环次数 延迟时间 */
  animation: move 2s ease infinite 0.1s;
}
```

​       常用动画属性：animation-iteration-count（循环次数，infinite=无限循环）、animation-direction（动画方向，reverse=反向）、animation-pause-on-hover（鼠标悬浮暂停动画）。

- 阴影（box-shadow/text-shadow）：给元素或文本添加阴影，增强视觉层次感

```
/* 盒子阴影：水平偏移 垂直偏移 模糊度 阴影大小 阴影颜色 内阴影（inset） */
box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.3);
/* 文本阴影：水平偏移 垂直偏移 模糊度 阴影颜色 */
text-shadow: 1px 1px 2px #333;
```

- 圆角（border-radius）：除了实现圆形，还可实现不规则圆角

```
border-radius: 10px 20px 30px 40px; /* 上左、上右、下右、下左（顺时针） */
border-radius: 50% 30%; /* 椭圆圆角 */
```

- 透明度（opacity）：控制元素整体透明度，值0-1（0=完全透明，1=不透明），会影响子元素     

```
opacity: 0.5; /* 元素及子元素都半透明 */
```

​       补充：rgba() 仅控制背景/文本透明度，不影响子元素（如 background-color: rgba(255,0,0,0.5);）。

- 弹性盒补充（calc() 函数）：动态计算样式值，支持加减乘除运算，可混合单位

```
width: calc(100% - 20px); /* 宽度 = 父容器宽度 - 20px */
height: calc(50px + 10px); /* 高度 = 50px + 10px */
```

### 2.4 响应式布局（核心，适配移动端、平板、PC）

核心思想：根据不同设备的屏幕宽度，应用不同的CSS样式，实现“一套代码，多端适配”，核心工具是「媒体查询（Media Query）」。

#### 1. 媒体查询基础语法

```css
/* 当屏幕宽度 ≤ 768px 时，应用以下样式（适配移动端） */
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 10px;
  }
  .nav {
    display: none; /* 隐藏导航栏 */
  }
  .mobile-nav {
    display: block; /* 显示移动端导航 */
  }
}

/* 当屏幕宽度 > 768px 且 ≤ 1200px 时，应用以下样式（适配平板） */
@media (min-width: 769px) and (max-width: 1200px) {
  .container {
    width: 90%;
    margin: 0 auto;
  }
}

/* 当屏幕宽度 > 1200px 时，应用以下样式（适配PC） */
@media (min-width: 1201px) {
  .container {
    width: 1200px;
    margin: 0 auto;
  }
}
```

#### 2. 响应式布局注意事项

- 必须在HTML头部添加视口配置（前文HTML基础结构已提及），否则媒体查询无效：

```
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

说明：```width=device-width```（让页面宽度等于设备屏幕宽度）、```user-scalable=no```（禁止用户缩放页面）。

- 采用“移动优先”原则（推荐）：先写移动端样式，再通过媒体查询写平板、PC端样式，减少代码冗余。
- 避免使用固定像素宽度，优先使用百分比（%）、fr、rem、vw/vh等自适应单位：

  - rem：相对根元素（html）的字体大小，默认1rem=16px，可通过设置html的font-size适配不同设备。

  - vw/vh：相对屏幕宽度/高度，1vw=屏幕宽度的1%，1vh=屏幕高度的1%。

图片自适应：给图片设置```max-width: 100%; height: auto;```，避免图片超出容器。

### 2.5 CSS 常见问题与解决方案

- 问题1：margin塌陷（前文盒模型已提及）
  - 解决方案：父元素添加```overflow: hidden```; 或``` border-top: 1px solid transparent```;。

- 问题2：浮动父容器塌陷
  - 解决方案：使用伪元素清除浮动（推荐），或给父元素添加```overflow: hidden```;。

- 问题3：元素垂直居中
  - 解决方案：Flex布局：父容器设置 ```display: flex; justify-content: center; align-items: center```;（最常用）。
    - 定位：子元素absolute + 父元素relative
    - 子元素设置``` top: 50%; left: 50%; transform: translate(-50%, -50%)```;。
    - 行内元素：设置 line-height = 父元素高度（仅单行文本有效）。

- 问题4：样式冲突
  - 解决方案：提高选择器优先级、避免滥用!important、合理使用class命名（如BEM命名规范）。

- 问题5：移动端适配错乱
  - 解决方案：检查视口配置、使用自适应单位、编写正确的媒体查询。


# 三、JavaScript（JS）—— 页面交互与逻辑

核心作用：控制HTML元素的行为和交互，实现页面动态效果（如点击事件、表单校验、数据请求等），是网页的“大脑”，可操作HTML（DOM）和CSS（CSSOM），实现前后端数据交互。

## 3.1 JavaScript 引入方式（3种，与CSS类似）

### 3.1.1 内联脚本（行内脚本，不推荐）

直接在HTML标签内通过事件属性写JS代码，仅作用于当前标签，不利于代码维护和复用。

```html
<button onclick="alert('点击成功！')">点击我</button>
```

### 3.1.2 内部脚本（嵌入脚本）

在HTML的head或body标签内，通过<script>标签写JS代码，作用于当前整个页面，适合写少量JS代码。

```html
<body>
  <button id="btn">点击我</button>
  <script>
    // 内部脚本代码
    const btn = document.getElementById('btn');
    btn.onclick = function() {
      alert('点击成功！');
    }
  </script>
</body>
```

注意：若脚本写在head标签内，需等待页面元素加载完成后再操作元素（可使用window.onload事件），否则会获取不到元素。

### 3.1.3 外部脚本（链接脚本，最推荐）

创建独立的.js文件，通过```<script>```标签的src属性引入HTML，作用于多个页面，利于代码复用和维护，适合写大量JS代码。

```html
// HTML中引入（推荐放在body标签末尾，避免阻塞页面加载）
<body>
  <button id="btn">点击我</button>
  <script src="./js/index.js"></script>
</body>

// index.js文件中
const btn = document.getElementById('btn');
btn.onclick = function() {
  alert('点击成功！');
}
```

补充：```<script>```标签的defer和async属性（用于控制脚本加载顺序）：

​            defer：脚本延迟执行，等待页面完全加载完成后再执行，不阻塞页面加载，多个defer脚本按顺序执行。			async：脚本异步加载，加载完成后立即执行，不阻塞页面加载，多个async脚本执行顺序不确定。

## 3.2 JavaScript 基础语法

### 3.2.1 变量与常量（存储数据）

JS中使用var、let、const声明变量/常量，推荐使用let和const（ES6新特性，解决var的缺陷）。

```javascript
// 1. var（不推荐，存在变量提升、作用域混乱等问题）
var name = '张三';
var age = 18;
var name = '李四'; // 可重复声明，不报错

// 2. let（声明变量，可修改，块级作用域）
let name = '张三';
name = '李四'; // 可修改
// let name = '王五'; // 不可重复声明，报错

// 3. const（声明常量，不可修改，块级作用域，必须初始化）
const PI = 3.14159;
// PI = 3.14; // 不可修改，报错
const arr = [1,2,3];
arr.push(4); // 允许修改数组/对象内部内容，不允许重新赋值
```

补充：块级作用域（ES6新特性）：变量/常量仅在当前代码块（{}内）有效，避免全局污染。

### 3.2.2 数据类型（6种基本类型 + 1种引用类型）

#### 1. 基本数据类型（值类型，直接存储值）

- string（字符串）：用单引号、双引号或反引号包裹，如 'abc'、"123"、`Hello ${name}`（模板字符串，ES6新特性）。
- number（数字）：整数、小数、负数、NaN（非数字，如10/'a'）、Infinity（无穷大，如10/0）。
- boolean（布尔值）：只有两个值，true（真）、false（假），常用于判断条件。
- undefined（未定义）：变量声明但未赋值，如 let a; console.log(a); // undefined。
- null（空值）：主动表示“空”，如 let a = null;（区别于undefined，null是主动赋值的空）。
- symbol（符号，ES6新特性）：唯一值，用于对象属性名，避免属性名冲突。

#### 2. 引用数据类型（引用类型，存储内存地址）

- object（对象）：最常用的引用类型，用于存储多个相关数据和方法，如 { name: '张三', age: 18, sayHi: function() {} }。
- 补充：数组（Array）、函数（Function）、日期（Date）、正则（RegExp）等本质上都是object类型的子集。

#### 3. 数据类型判断

```javascript
// 1. typeof：判断基本数据类型（除null外）、函数
console.log(typeof 'abc'); // string
console.log(typeof 123); // number
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined
console.log(typeof null); // object（bug，记住即可）
console.log(typeof function(){}); // function

// 2. instanceof：判断引用数据类型
console.log([1,2,3] instanceof Array); // true
console.log({} instanceof Object); // true

// 3. Object.prototype.toString.call()：万能判断方法（最准确）
console.log(Object.prototype.toString.call(null)); // [object Null]
console.log(Object.prototype.toString.call([1,2,3])); // [object Array]
```

### 3.2.3 运算符（用于数据运算、逻辑判断）

运算符是JS中用于处理数据的核心工具，按功能分为5大类，重点掌握常用运算符及使用场景，避免踩坑。

#### 1. 算术运算符（用于数值运算）

```javascript
// 基本算术运算符
let a = 10, b = 3;
console.log(a + b); // 13（加法）
console.log(a - b); // 7（减法）
console.log(a * b); // 30（乘法）
console.log(a / b); // 3.333...（除法，注意：JS中除法不会自动取整）
console.log(a % b); // 1（取余/模运算，求余数）

// 自增/自减运算符（常用，简化代码）
let c = 5;
console.log(c++); // 5（先输出，再自增）
console.log(++c); // 7（先自增，再输出）
console.log(c--); // 7（先输出，再自减）
console.log(--c); // 5（先自减，再输出）
```

注意：1. 加法运算符（+）可用于拼接字符串（如 'Hello' + 'World' → 'HelloWorld'），若一方是字符串，另一方会自动转为字符串；2. 除法运算中，0除以0结果为NaN，非0数除以0结果为Infinity。

#### 2. 赋值运算符（用于给变量赋值，简化代码）

```javascript
let x = 10;
x += 5; // 等价于 x = x + 5 → x = 15
x -= 3; // 等价于 x = x - 3 → x = 12
x *= 2; // 等价于 x = x * 2 → x = 24
x /= 4; // 等价于 x = x / 4 → x = 6
x %= 2; // 等价于 x = x % 2 → x = 0
```

#### 3. 比较运算符（用于判断两个值的关系，返回布尔值true/false）

```javascript
let m = 5, n = '5';
// 相等/不相等（会自动转换数据类型，不推荐）
console.log(m == n); // true（值相等，类型不同但自动转换）
console.log(m != n); // false

// 全等/不全等（严格判断，值和类型都必须相等，推荐使用）
console.log(m === n); // false（值相等，类型不同：number vs string）
console.log(m !== n); // true

// 大小比较
console.log(m > 3); // true
console.log(m <= 5); // true
console.log(n > 6); // false（字符串'5'会转为数字5再比较）
```

重点：推荐使用全等（===）和不全等（!==），避免自动类型转换导致的判断错误（如 0 == false 会返回true，不符合预期）。

#### 4. 逻辑运算符（用于逻辑判断，返回布尔值或原始值，常用在条件判断中）

```javascript
let flag1 = true, flag2 = false;
// 逻辑与（&&）：两个都为true，结果才为true；有一个为false，结果为false
console.log(flag1 && flag2); // false
// 短路特性：左边为false，右边不执行（常用简化代码）
let num1 = 0;
flag2 && (num1 = 10); // flag2为false，右边不执行，num1仍为0

// 逻辑或（||）：两个有一个为true，结果就为true；都为false，结果为false
console.log(flag1 || flag2); // true
// 短路特性：左边为true，右边不执行（常用设置默认值）
let username = '';
let defaultName = username || '游客'; // username为空，取默认值'游客'

// 逻辑非（!）：取反，true变false，false变true
console.log(!flag1); // false
console.log(!0); // true（0、''、null、undefined、NaN 会被转为false，取反后为true）
```

#### 5. 三元运算符（三目运算符，简化if-else条件判断，语法：条件 ? 成立时执行 : 不成立时执行）

```javascript
// 示例1：判断年龄是否成年
let age = 19;
let isAdult = age >= 18 ? '成年' : '未成年';
console.log(isAdult); // 成年

// 示例2：简化赋值
let score = 85;
let grade = score >= 90 ? '优秀' : (score &gt;= 80 ? '良好' : '及格');
console.log(grade); // 良好
```

注意：三元运算符可嵌套，但嵌套层数不宜过多（建议不超过2层），否则会影响代码可读性。

### 3.2.4 条件语句（用于根据不同条件执行不同代码）

条件语句的核心是“判断”，根据条件的真假，执行对应的代码块，常用有if-else和switch-case两种。

#### 1. if-else 语句（适用于多种条件判断）

```javascript
// 基本语法：if（条件）{ 条件成立执行的代码 }
let score = 75;
if (score >= 90) {
  console.log('优秀');
} else if (score >= 80) { // 可选，多个条件判断
  console.log('良好');
} else if (score >= 60) {
  console.log('及格');
} else { // 可选，所有条件都不成立时执行
  console.log('不及格');
}
```

补充：if后面的条件必须是布尔值（true/false），若不是，JS会自动将其转为布尔值（0、''、null、undefined、NaN 转为false，其余转为true）。

#### 2. switch-case 语句（适用于固定值的判断，如菜单选择、状态判断）

```javascript
// 基本语法：switch（变量）{ case 值1: 执行代码; break; ... default: 默认执行代码; }
let week = 3;
switch (week) {
  case 1:
    console.log('星期一');
    break; // 必须加break，否则会继续执行下一个case（穿透现象）
  case 2:
    console.log('星期二');
    break;
  case 3:
    console.log('星期三');
    break;
  case 4:
    console.log('星期四');
    break;
  case 5:
    console.log('星期五');
    break;
  case 6:
    console.log('星期六');
    break;
  case 7:
    console.log('星期日');
    break;
  default: // 可选，变量不匹配任何case时执行
    console.log('输入错误');
}
```

注意：1. switch判断是“全等判断”（===），变量和case值的类型必须一致；2. break关键字不可省略（除非需要利用穿透现象），否则会执行所有后续case的代码。

### 3.2.5 循环语句（用于重复执行一段代码，减少冗余）

循环语句适用于需要重复执行的场景（如遍历数组、计算累加和等），常用有for、while、do-while三种，重点掌握for循环。

#### 1. for 循环（适用于已知循环次数的场景）

```javascript
// 基本语法：for（初始化变量; 循环条件; 变量更新）{ 循环执行的代码 }
// 示例1：计算1-10的累加和
let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i; // 等价于 sum = sum + i
}
console.log(sum); // 55

// 示例2：遍历数组（重点，后续常用）
let arr = [10, 20, 30, 40];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // 依次输出10、20、30、40
}
```

补充：for循环的三个部分都可省略（如 for(;;) 会变成无限循环），但分号不能省略，实际开发中避免无限循环（会导致页面卡死）。

#### 2. while 循环（适用于未知循环次数，只知道循环条件的场景）

```javascript
// 基本语法：while（循环条件）{ 循环执行的代码; 变量更新 }
// 示例：计算1-100中所有偶数的和
let evenSum = 0;
let i = 2;
while (i <= 100) {
  evenSum += i;
  i += 2; // 变量更新，避免无限循环
}
console.log(evenSum); // 2550
```

注意：while循环必须在循环体内更新变量，否则会导致无限循环。

#### 3. do-while 循环（与while循环类似，区别：先执行一次循环体，再判断条件）

```javascript
// 基本语法：do { 循环执行的代码; 变量更新 } while（循环条件）;
// 示例：无论条件是否成立，先执行一次循环体
let num = 11;
do {
  console.log(num); // 输出11（即使num>10，仍执行一次）
  num++;
} while (num <= 10);
```

特点：循环体至少执行一次，适用于“必须执行一次”的场景（如用户输入校验，先获取一次输入，再判断是否符合要求）。

#### 4. 循环控制语句（break、continue）

```javascript
// 1. break：终止整个循环，跳出循环体
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    break; // 当i=3时，终止循环
  }
  console.log(i); // 输出1、2
}

// 2. continue：跳过当前次循环，继续执行下一次循环
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue; // 当i=3时，跳过本次循环，不执行console.log
  }
  console.log(i); // 输出1、2、4、5
}
```

### 3.2.6 数组（Array，常用引用类型，用于存储多个数据）

数组是JS中最常用的数据结构之一，可存储任意类型的数据（数字、字符串、对象、函数等），长度可动态变化，核心是“批量管理数据”。

#### 1. 数组的创建方式（3种常用）

```javascript
// 方式1：字面量创建（最推荐，简洁高效）
let arr1 = [10, 20, 30, 'hello', true]; // 可存储多种类型数据
// 方式2：构造函数创建
let arr2 = new Array(10, 20, 30); // 传入多个值，创建包含这些值的数组
let arr3 = new Array(5); // 传入一个数字，创建长度为5、默认值为undefined的数组
// 方式3：Array.of() 创建（ES6新特性，避免构造函数的歧义）
let arr4 = Array.of(5); // [5]，区别于new Array(5)
let arr5 = Array.of(10, 20, 30); // [10,20,30]
```

#### 2. 数组的核心属性与方法

核心属性：length（获取/设置数组长度）

```javascript
let arr = [1,2,3];
console.log(arr.length); // 3（获取长度）
arr.length = 5; // 设置长度，多余位置填充undefined，数组变为[1,2,3,undefined,undefined]
arr.length = 2; // 缩短长度，多余元素被删除，数组变为[1,2]
```

常用方法（按功能分类，配实操示例）：

##### （1）增删改查

```javascript
let arr = [10, 20, 30];

// 1. 增：添加元素到数组
arr.push(40); // 末尾添加，返回新长度，arr变为[10,20,30,40]
arr.unshift(0); // 开头添加，返回新长度，arr变为[0,10,20,30,40]
arr.splice(2, 0, 15); // 中间添加：splice(起始索引, 删除个数, 要添加的元素)，arr变为[0,10,15,20,30,40]

// 2. 删：删除数组元素
arr.pop(); // 删除末尾元素，返回被删除的元素，arr变为[0,10,15,20,30]
arr.shift(); // 删除开头元素，返回被删除的元素，arr变为[10,15,20,30]
arr.splice(1, 1); // 中间删除：splice(起始索引, 删除个数)，删除索引1的元素，arr变为[10,20,30]

// 3. 改：修改数组元素（直接通过索引赋值）
arr[1] = 25; // 修改索引1的元素，arr变为[10,25,30]

// 4. 查：查找数组元素
console.log(arr[0]); // 通过索引查找，输出10
console.log(arr.indexOf(25)); // 查找元素位置，返回索引1（找不到返回-1）
console.log(arr.includes(30)); // 判断元素是否存在，返回true（ES6新特性）
```

##### （2）数组遍历

```javascript
let arr = [10, 20, 30, 40];

// 方式1：for循环（最基础，灵活控制）
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // 依次输出10、20、30、40
}

// 方式2：for...of 循环（ES6新特性，简洁，适合遍历值）
for (let item of arr) {
  console.log(item); // 依次输出10、20、30、40
}

// 方式3：forEach 方法（最常用，专门用于数组遍历，无返回值）
arr.forEach(function(item, index, arr) {
  // item：当前遍历的元素，index：当前元素索引，arr：原数组
  console.log(`索引${index}：${item}`);
});

// 方式4：map 方法（常用，遍历并返回新数组，不改变原数组）
let newArr = arr.map(item => item * 2); // 每个元素乘2，newArr为[20,40,60,80]，原arr不变
```

##### （3）其他常用方法

```javascript
let arr = [10, 20, 30, 40];

// 1. filter：过滤数组，返回满足条件的新数组
let filterArr = arr.filter(item => item > 20); // [30,40]

// 2. find：查找满足条件的第一个元素，返回该元素（找不到返回undefined）
let findItem = arr.find(item => item > 20); // 30

// 3. reduce：累加/累乘，返回最终结果（常用）
let sum = arr.reduce((prev, curr) => prev + curr, 0); // 累加，prev是上一次结果，curr是当前元素，初始值0，sum=100

// 4. join：将数组转为字符串，参数为分隔符（默认逗号）
let str = arr.join('-'); // "10-20-30-40"

// 5. reverse：反转数组（改变原数组）
arr.reverse(); // [40,30,20,10]

// 6. slice：截取数组，返回新数组（不改变原数组），slice(起始索引, 结束索引)（结束索引不包含）
let sliceArr = arr.slice(1, 3); // [30,20]

// 7. concat：合并数组，返回新数组（不改变原数组）
let arr2 = [50, 60];
let concatArr = arr.concat(arr2); // [40,30,20,10,50,60]
```

### 3.2.7 函数（Function，用于封装可复用的代码）

函数是JS的核心组件，本质是“可复用的代码块”，用于封装逻辑、简化代码、提高复用性，可接收参数、返回结果。

#### 1. 函数的创建方式（3种常用）

```javascript
// 方式1：函数声明（最常用，有函数提升，可在声明前调用）
function add(a, b) {
  return a + b; // return：返回函数结果，无return则返回undefined
}
console.log(add(10, 20)); // 30

// 方式2：函数表达式（无函数提升，不可在声明前调用）
let subtract = function(a, b) {
  return a - b;
};
console.log(subtract(20, 10)); // 10

// 方式3：箭头函数（ES6新特性，简洁，无this绑定，适合简单逻辑）
let multiply = (a, b) => a * b; // 省略{}和return（只有一句代码时）
console.log(multiply(10, 3)); // 30

// 箭头函数完整写法（多句代码需加{}和return）
let divide = (a, b) => {
  if (b === 0) return '除数不能为0';
  return a / b;
};
console.log(divide(10, 2)); // 5
```

#### 2. 函数的参数与返回值

（1）参数：分为形参（函数声明时定义的参数）和实参（函数调用时传入的参数），JS中参数个数可不一致（不报错）。

```javascript
function sum(a, b) { // a、b是形参
  console.log(a, b);
  return a + b;
}
sum(10, 20); // 10、20是实参，输出10 20，返回30
sum(10); // 实参不足，b为undefined，输出10 undefined，返回NaN
sum(10, 20, 30); // 实参过多，多余参数被忽略，输出10 20，返回30

// 给形参设置默认值（ES6新特性）
function greet(name = '游客') {
  return `你好，${name}！`;
}
console.log(greet()); // 你好，游客！
console.log(greet('张三')); // 你好，张三！
```

（2）返回值：通过return语句返回，return后面的代码不会执行；无return时，函数默认返回undefined。

```javascript
function test() {
  return '返回值';
  console.log('这句话不会执行'); // 被return阻断
}
console.log(test()); // 返回值

function test2() {
  // 无return
}
console.log(test2()); // undefined
```

#### 3. 函数的作用域与作用域链

作用域：函数内声明的变量/函数，仅在函数内部有效（局部作用域）；函数外声明的变量（全局作用域），整个页面有效。

```javascript
// 全局变量（整个页面有效）
let globalVar = '全局变量';

function fn() {
  // 局部变量（仅函数内部有效）
  let localVar = '局部变量';
  console.log(globalVar); // 可访问全局变量，输出全局变量
  console.log(localVar); // 可访问局部变量，输出局部变量
}
fn();
console.log(localVar); // 报错，无法访问函数内的局部变量
```

作用域链：当访问一个变量时，JS会先在当前作用域查找，找不到则向上查找父级作用域，直到找到全局作用域，找不到则报错。

### 3.2.8 对象（Object，核心引用类型，用于存储多个相关数据和方法）

对象是JS中最核心的引用类型，本质是“键值对的集合”，键（key）是字符串（可省略引号），值（value）可是任意类型（数字、字符串、函数、对象等）。

#### 1. 对象的创建方式（3种常用）

```javascript
// 方式1：字面量创建（最推荐，简洁高效）
let person = {
  name: '张三', // 键：name，值：'张三'
  age: 18,
  gender: '男',
  sayHi: function() { // 方法（值为函数）
    console.log(`你好，我是${this.name}，今年${this.age}岁`);
  }
};

// 方式2：构造函数创建（适合创建多个同类对象）
function Person(name, age, gender) {
  this.name = name;
  this.age = age;
  this.gender = gender;
  this.sayHi = function() {
    console.log(`你好，我是${this.name}，今年${this.age}岁`);
  };
}
let person1 = new Person('张三', 18, '男');
let person2 = new Person('李四', 20, '女');

// 方式3：Object构造函数创建（不常用）
let car = new Object();
car.brand = '华为';
car.price = 200000;
car.run = function() {
  console.log(`${this.brand}汽车正在行驶`);
};
```

#### 2. 对象的属性访问与修改

```javascript
let person = {
  name: '张三',
  age: 18
};

// 1. 访问属性（两种方式）
console.log(person.name); // 点语法（推荐，简洁），输出张三
console.log(person['age']); // 方括号语法（适合键名有特殊字符、变量作为键名），输出18

// 2. 修改属性
person.age = 19; // 点语法修改
person['name'] = '张小三'; // 方括号语法修改
console.log(person); // {name: '张小三', age: 19}

// 3. 添加新属性
person.gender = '男';
person['height'] = 180;
console.log(person); // {name: '张小三', age: 19, gender: '男', height: 180}

// 4. 删除属性（delete关键字）
delete person.height;
console.log(person); // {name: '张小三', age: 19, gender: '男'}
```

#### 3. 对象的遍历

```javascript
let person = {
  name: '张三',
  age: 18,
  gender: '男'
};

// 方式1：for...in 循环（最常用，遍历对象的所有键）
for (let key in person) {
  // key：对象的键，person[key]：对象的值
  console.log(`${key}: ${person[key]}`);
}

// 方式2：Object.keys() + forEach（ES6新特性，先获取所有键，再遍历）
Object.keys(person).forEach(key => {
  console.log(`${key}: ${person[key]}`);
});
```

### 3.3 DOM 操作（JS操作HTML元素的基础）

DOM（文档对象模型）：将HTML文档解析为一个树形结构，每个HTML元素都是一个“DOM节点”，JS通过DOM操作，可实现对HTML元素的增删改查、样式修改等交互效果。

#### 1. 获取DOM元素（先获取才能操作）

常用获取方法（按使用频率排序）：

```javascript
// 1. 根据id获取（最精准，id唯一）
let btn = document.getElementById('btn'); // 获取id为btn的元素

// 2. 根据类名获取（返回伪数组，需遍历）
let boxes = document.getElementsByClassName('box'); // 获取所有class为box的元素
console.log(boxes[0]); // 获取第一个box元素

// 3. 根据标签名获取（返回伪数组，需遍历）
let divs = document.getElementsByTagName('div'); // 获取所有div元素

// 4. 根据选择器获取（ES6新特性，推荐，灵活）
let singleBox = document.querySelector('.box'); // 获取第一个匹配选择器的元素（支持id、类、标签选择器）
let allBoxes = document.querySelectorAll('.box'); // 获取所有匹配选择器的元素（返回伪数组）
```

注意：获取DOM元素必须在元素加载完成后执行（可将脚本放在body末尾，或使用window.onload事件）。

#### 2. 操作DOM元素的内容

```javascript
let box = document.querySelector('.box');

// 1. innerText：获取/设置元素的纯文本（不解析HTML标签）
console.log(box.innerText); // 获取纯文本
box.innerText = '新的文本内容'; // 设置纯文本
box.innerText = '<strong>加粗文本</strong>'; // 不会解析标签，显示为<strong>加粗文本</strong>

// 2. innerHTML：获取/设置元素的HTML内容（解析HTML标签）
console.log(box.innerHTML); // 获取包含HTML标签的内容
box.innerHTML = '新的<strong>加粗文本</strong>'; // 解析标签，文本会加粗
box.innerHTML = ''; // 清空元素内容

// 3. value：获取/设置表单元素的值（如input、textarea）
let input = document.querySelector('input');
console.log(input.value); // 获取输入框内容
input.value = '默认输入内容'; // 设置输入框内容
```

#### 3. 操作DOM元素的样式

```javascript
let box = document.querySelector('.box');

// 1. 直接操作style属性（行内样式，优先级高）
box.style.width = '200px';
box.style.height = '200px';
box.style.backgroundColor = 'red'; // 注意：CSS属性驼峰命名（如background-color → backgroundColor）
box.style.fontSize = '16px';

// 2. 操作class类名（推荐，利于样式复用，不破坏行内样式）
// 添加类名
box.classList.add('active'); // 给box添加active类
// 移除类名
box.classList.remove('active'); // 移除box的active类
// 切换类名（有则移除，无则添加，常用在点击切换效果）
box.classList.toggle('active');
// 判断是否有某个类名
console.log(box.classList.contains('active')); // 返回true/false
```

#### 4. 操作DOM元素（增删改）

```javascript
// 1. 创建新元素
let newDiv = document.createElement('div'); // 创建div元素
newDiv.innerText = '新创建的div';
newDiv.style.backgroundColor = 'blue';

// 2. 添加元素（插入到页面中）
let container = document.querySelector('.container');
container.appendChild(newDiv); // 插入到container的末尾
container.insertBefore(newDiv, container.firstChild); // 插入到container的第一个子元素前面

// 3. 修改元素（替换元素）
let oldDiv = document.querySelector('.old-div');
container.replaceChild(newDiv, oldDiv); // 用newDiv替换oldDiv

// 4. 删除元素
container.removeChild(newDiv); // 删除container中的newDiv
// 简化删除（直接删除自身）
newDiv.remove();
```

### 3.4 事件处理（实现页面交互）

事件：用户在页面上的操作（如点击、鼠标悬浮、输入等），JS通过“绑定事件”，监听用户操作，执行对应的代码（事件处理函数）。

#### 1. 常用事件类型

- 点击事件：click（鼠标点击元素）
- 鼠标事件：mouseover（鼠标悬浮）、mouseout（鼠标离开）、mousemove（鼠标移动）
- 表单事件：input（输入框输入内容）、change（表单元素值改变）、submit（表单提交）、blur（输入框失去焦点）、focus（输入框获取焦点）
- 键盘事件：keydown（按下键盘）、keyup（松开键盘）
- 页面事件：load（页面加载完成）、resize（窗口大小改变）

#### 2. 事件绑定方式（3种常用）

```javascript
let btn = document.getElementById('btn');

// 方式1：行内事件（不推荐，不利于维护，前文已提及）
// <button id="btn" onclick="alert('点击了')">点击我</button>

// 方式2：事件属性绑定（简单，适合少量事件）
btn.onclick = function() {
  alert('点击成功！');
};
// 移除事件
btn.onclick = null;

// 方式3：addEventListener（推荐，可绑定多个同类型事件，支持事件捕获/冒泡）
btn.addEventListener('click', function() {
  alert('第一次点击');
});
btn.addEventListener('click', function() {
  alert('第二次点击'); // 点击后会依次执行两个事件处理函数
});
// 移除事件（需使用命名函数）
function clickHandler() {
  alert('可移除的点击事件');
}
btn.addEventListener('click', clickHandler);
btn.removeEventListener('click', clickHandler);
```

#### 3. 事件对象（event）

事件触发时，会自动生成一个“事件对象”，包含事件相关的信息（如点击位置、触发事件的元素等），可在事件处理函数中接收。

```javascript
btn.addEventListener('click', function(event) {
  // event：事件对象（可简写为e）
  console.log(event.target); // 触发事件的元素（当前点击的btn）
  console.log(event.clientX, event.clientY); // 鼠标点击的坐标（相对于浏览器窗口）
  event.preventDefault(); // 阻止事件默认行为（如阻止表单提交、链接跳转）
  event.stopPropagation(); // 阻止事件冒泡（后续讲解）
});

// 阻止表单默认提交行为（示例）
let form = document.querySelector('form');
form.addEventListener('submit', function(e) {
  e.preventDefault(); // 阻止表单默认提交，避免页面刷新
  // 后续可写表单校验、数据提交等逻辑
});
```

#### 4. 事件冒泡与事件捕获（补充）

事件冒泡：事件从触发元素（子元素）向上传播到父元素、祖先元素，直到document（默认行为）。

事件捕获：事件从document向下传播到父元素、子元素，直到触发元素（需手动设置）。

```javascript
// 事件冒泡示例
let parent = document.querySelector('.parent');
let child = document.querySelector('.child');

parent.addEventListener('click', () => {
  console.log('父元素被点击');
});
child.addEventListener('click', () => {
  console.log('子元素被点击');
});
// 点击子元素，会先输出“子元素被点击”，再输出“父元素被点击”（冒泡）

// 阻止事件冒泡
child.addEventListener('click', (e) => {
  e.stopPropagation(); // 阻止冒泡
  console.log('子元素被点击');
});
// 点击子元素，仅输出“子元素被点击”，父元素不触发
```

### 3.5 表单校验（结合DOM和事件）

表单校验是前端常见需求，用于验证用户输入的内容是否符合要求（如手机号、邮箱格式、密码长度等），避免无效数据提交。

```javascript
// 示例：简单表单校验（手机号+密码）
let form = document.querySelector('form');
let phoneInput = document.querySelector('input[name="phone"]');
let pwdInput = document.querySelector('input[name="password"]');
let tip = document.querySelector('.tip');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // 阻止表单默认提交
  let phone = phoneInput.value.trim(); // 去除首尾空格
  let pwd = pwdInput.value.trim();

  // 校验手机号（简单正则，11位数字）
  let phoneReg = /^1[3-9]\d{9}$/;
  if (!phone) {
    tip.innerText = '请输入手机号';
    tip.style.color = 'red';
    return;
  }
  if (!phoneReg.test(phone)) {
    tip.innerText = '请输入正确的手机号';
    tip.style.color = 'red';
    return;
  }

  // 校验密码（长度≥6位）
  if (!pwd) {
    tip.innerText = '请输入密码';
    tip.style.color = 'red';
    return;
  }
  if (pwd.length < 6) {
    tip.innerText = '密码长度不能少于6位';
    tip.style.color = 'red';
    return;
  }

  // 校验通过，可提交数据（后续可对接后端接口）
  tip.innerText = '校验通过，准备提交！';
  tip.style.color = 'green';
  // form.submit(); // 手动提交表单（如需）
});

// 输入框失去焦点时校验（优化体验）
phoneInput.addEventListener('blur', function() {
  let phone = this.value.trim();
  let phoneReg = /^1[3-9]\d{9}$/;
  if (phone && !phoneReg.test(phone)) {
    tip.innerText = '请输入正确的手机号';
    tip.style.color = 'red';
  } else if (!phone) {
    tip.innerText = '请输入手机号';
    tip.style.color = 'red';
  } else {
    tip.innerText = '';
  }
});
```

### 3.6 JavaScript 常见问题与解决方案

- 问题1：获取DOM元素为null，无法操作？ 解决方案：确保脚本在元素加载完成后执行（放在body末尾，或使用window.onload事件）。
- 问题2：数组遍历后修改元素，原数组不变？ 解决方案：区分“修改原数组的方法”（push、pop、splice等）和“返回新数组的方法”（map、filter等），根据需求选择。
- 问题3：箭头函数中this指向异常？ 解决方案：箭头函数没有自己的this，this指向父级作用域的this；若需要操作当前元素的this，使用普通函数。
- 问题4：表单提交后页面刷新？ 解决方案：在表单submit事件中使用event.preventDefault()阻止默认行为。
- 问题5：变量污染（全局变量重复声明）？ 解决方案：尽量使用let/const声明变量，避免var；将代码封装在函数中，减少全局变量；使用ES6模块（import/export）。

