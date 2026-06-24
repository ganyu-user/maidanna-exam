# 任务二：网上书店管理系统（SPA）

## 技术栈

- TypeScript
- Redux（状态管理）
- 原生 JS 操作 DOM
- Redux 通过 CDN 引入

## 功能清单

### 必做

- [x] 主页面显示书籍列表（书名、价格、分类、删除按钮）
- [x] 顶部"添加书籍"按钮，点了弹个窗
- [x] 新增弹窗：填书名、价格、分类、描述，提交后加到列表里
- [x] 点击某一行 → 弹出编辑窗口
- [x] 编辑弹窗：可以改所有信息，保存后更新
- [x] 编辑弹窗里也有删除按钮
- [x] 数据都存在前端数组里，不用后端

### 加分项（选做了一个）

- [x] **Sort By 排序功能** — 可以按书名/价格/分类排序，支持升序降序

## 运行

项目里已经写了个简单的静态服务器 `server.js`：

```bash
cd task-book-spa
node server.js
```
然后浏览器打开 `http://localhost:8080` 就行。


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
└── README.md               
```

> 注：`dist/app.js` 是我手动编译好放进去的，tsc环境。源码在 `src/` 目录下，都是 TypeScript。

## 代码组织

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
1. **Redux 的类型** — 因为 Redux 是 CDN 引的，类型声明有点麻烦，就用了 `any` 
2. **闭包问题** — 循环里给按钮绑事件的时候，一开始直接用循环变量，结果所有按钮都指向最后一本书。后来用了立即执行函数（IIFE）把每次的 book 存起来

## 还有哪些可以改进的地方
- 加上批量删除（左边加 checkbox）
- 可以加个搜索框
- 数据存在 localStorage 里，刷新页面不丢
- 用 Vue 或者 React 重写一下，代码会更清晰
