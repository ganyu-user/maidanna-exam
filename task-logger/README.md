# 任务一：Logger 日志系统

这是面试题的第一个任务，用 TypeScript 写一个日志记录器。

## 功能说明

- 四种日志等级：verbose、info、warning、error
- 目前日志输出到 console
- 以后可能要扩展到写文件，所以代码结构上留了口子
- 不依赖第三方库，纯手写

## 怎么用

最简单的用法：

```typescript
import { Logger } from './src/index';

const logger = new Logger('UserModule');  // 括号里的是标签，用来区分是哪个模块打的日志

logger.verbose('调试用的，最详细的那种');
logger.info('普通的业务日志');
logger.warning('警告一下');
logger.error('出错了！');
```

同时输出到多个地方（比如控制台 + 文件）：

```typescript
import { Logger, LogLevel, FileAppender } from './src/index';

const logger = new Logger('OrderModule');

// 加一个文件输出器
// 第一个参数是文件路径，第二个参数是最低输出等级（低于这个等级的不写文件）
const fileAppender = new FileAppender('./logs/app.log', LogLevel.INFO);
logger.addAppender(fileAppender);

logger.info('这条会同时出现在控制台和文件里');
logger.verbose('这条只有控制台有，因为等级太低文件不记');
```

> 注意：现在的 FileAppender 是模拟的，不是真的写文件。控制台会打印 `[File IO xxx]` 假装写了。等以后真的要写文件的时候，把 `NativeFileWriteSync` 函数换成真实的 fs 调用就行。

## 设计思路

大概是参考 log4j 那种思路（虽然我也没用过几次），分成几个部分：

1. **Logger 类** — 给外面调用的，业务代码就用这个。提供 verbose/info/warning/error 四个方法。
2. **Appender 接口** — 定义了 `append()` 方法，真正的输出逻辑由各个实现类来做。
3. **ConsoleAppender** — 输出到控制台的实现。
4. **FileAppender** — 输出到文件的实现（目前是模拟的）。

为什么这么搞？主要是以后好扩展。比如以后要加个"把错误日志发到钉钉群"的功能，不用改原来的代码，只要新写一个 `DingTalkAppender` 实现 `LogAppender` 接口，然后 `logger.addAppender(new DingTalkAppender())` 就搞定了。这好像叫什么开闭原则来着？

每个 Appender 可以自己设置最低输出等级，比如：
- 控制台输出所有（方便调试）
- 文件只记 info 及以上
- 钉钉告警只收 error 级别的

## 日志等级

从低到高：

| 等级      | 数值 | 用途                     |
| --------- | ---- | ------------------------ |
| VERBOSE   | 0    | 最详细的调试信息，平时一般不开 |
| INFO      | 1    | 正常的业务信息             |
| WARNING   | 2    | 警告，不影响运行但要注意    |
| ERROR     | 3    | 错误，需要处理的那种       |

## 文件结构

```
task-logger/
├── src/
│   ├── index.ts              统一导出
│   ├── types.ts              类型定义（LogLevel枚举、LogMessage接口、LogAppender接口）
│   ├── Logger.ts             Logger 主类
│   └── appenders/
│       ├── ConsoleAppender.ts   控制台输出
│       └── FileAppender.ts      文件输出（模拟）
├── example.ts                使用示例（可以直接跑了看看效果）
└── README.md                 就是你现在看的这个
```

## 以后怎么扩展

### 加新的输出方式

比如以后要加远程日志服务器：

1. 在 `src/appenders/` 下新建 `RemoteAppender.ts`
2. 实现 `LogAppender` 接口的 `append` 方法
3. 用的时候 `logger.addAppender(new RemoteAppender(url))`

完事儿，其他代码一行不用动。

### 真的写文件

把 `FileAppender.ts` 里的 `NativeFileWriteSync` 函数换成 Node.js 的 `fs.appendFileSync` 就行。其他都不用改。

## 已知的问题/不足

- 现在是同步写的，如果以后输出到远程服务器可能会卡，到时候再改成异步吧
- 格式化逻辑写在每个 Appender 里了，有点重复，以后可以抽个 Formatter 出来
- 没有日志滚动（文件大了自动分割），等真的用到再说

## 怎么跑示例

有 Node.js 环境的话，装个 ts-node 直接跑：

```
npm install -g ts-node
ts-node example.ts
```

或者先编译成 js 再跑也行。
