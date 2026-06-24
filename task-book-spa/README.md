# 任务二：网上书店管理系统（SPA）

面试题的第二个任务，做一个单页面的书店管理应用。

## 技术栈

- TypeScript
- Redux（状态管理）
- 原生 JS 操作 DOM（没用到 Vue/React 框架，因为不太熟...）
- Redux 是通过 CDN 引入的，不用装依赖

## 功能清单

### 必做的

- [x] 主页面显示书籍列表（书名、价格、分类、删除按钮）
- [x] 顶部"添加书籍"按钮，点了弹个窗
- [x] 新增弹窗：填书名、价格、分类、描述，提交后加到列表里
- [x] 点击某一行 → 弹出编辑窗口
- [x] 编辑弹窗：可以改所有信息，保存后更新
- [x] 编辑弹窗里也有删除按钮
- [x] 数据都存在前端数组里，不用后端

### 加分项（选做了一个）

- [x] **Sort By 排序功能** — 可以按书名/价格/分类排序，支持升序降序

（其他加分项像批量删除、GitHub Pages 部署什么的，时间不太够就没做，见谅）

## 怎么运行

直接打开 `index.html` 好像不行，因为浏览器安全策略啥的。起个本地服务器吧：

### 方法一：用 Node.js（推荐）

项目里已经写了个简单的静态服务器 `server.js`：

```bash
cd task-book-spa
node server.js
```

然后浏览器打开 `http://localhost:8080` 就行。

### 方法二：用 Python

如果有 Python 的话：

```bash
cd task-book-spa
python -m http.server 8080
```

然后同样打开 `http://localhost:8080`。

## 文件结构

```
task-book-spa/
├── src/
│   ├── types/
│   │   └── book.ts         类型定义（Book接口、SortField、SortOrder）
│   ├── store/
│   │   ├── actions.ts      Redux 的 action creators
│   │   └── reducer.ts      Redux 的 reducer（纯函数）
│   └── app.ts              主入口：DOM操作、事件绑定、渲染逻辑
├── dist/
│   └── app.js              编译出来的 JS（直接能跑的）
├── index.html              页面
├── server.js               本地静态服务器
├── tsconfig.json           TypeScript 配置
├── package.json            项目配置
└── README.md               你正在看的这个
```

> 注：`dist/app.js` 是我手动编译好放进去的，怕面试那边没有 tsc 环境跑不起来。源码在 `src/` 目录下，都是 TypeScript。

## 代码大概是怎么组织的

### 1. 类型定义（types/book.ts）

定义了 `Book` 接口，还有排序相关的类型。

### 2. Redux 部分（store/）

- `actions.ts` — 定义了几个 action：添加、更新、删除、设置排序
- `reducer.ts` — 处理这些 action，返回新的 state
- 状态里除了书籍列表，还存了 `nextId`（自增ID用的）和排序信息

### 3. 主逻辑（app.ts）

- 拿 DOM 元素
- `renderBookList()` 函数负责把数据渲染到页面上
- 弹窗的打开关闭、表单校验
- 事件绑定
- 订阅 Redux 的变化，状态一变就重新渲染

## 排序功能说明

在页面右上角有两个下拉框：
- 第一个选按什么排：书名 / 价格 / 分类
- 第二个选升序还是降序

改了之后列表马上就重新排序了，排序状态存在 Redux 里。

## 遇到的一些坑

1. **TypeScript 编译环境搞不定** — 本来想直接用 tsc 命令编译，结果 npm 装 typescript 好像没装上（也可能是我不会弄），最后就手动写了一份 JS 放在 dist 里，保证能直接跑。源码还是保留了 TS 版本的。
2. **Redux 的类型** — 因为 Redux 是 CDN 引的，类型声明有点麻烦，就用了 `any` 凑合一下，反正能跑。
3. **闭包问题** — 循环里给按钮绑事件的时候，一开始直接用循环变量，结果所有按钮都指向最后一本书。后来用了立即执行函数（IIFE）把每次的 book 存起来，才搞定。

## 还有哪些可以改进的地方

- 加上批量删除（左边加 checkbox）
- 可以加个搜索框
- 数据存在 localStorage 里，刷新页面不丢
- 用 Vue 或者 React 重写一下，代码会更清晰
- 表单验证可以做得更细一点，比如价格的小数位限制
- 响应式布局，手机上看可能有点挤
