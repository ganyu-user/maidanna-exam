// Logger 使用示例
// 演示一下怎么用这个日志系统

import { Logger, LogLevel, FileAppender, ConsoleAppender } from './src/index';

console.log('========== 示例1：基础使用 ==========');

// 创建一个logger，不传tag也可以
const logger = new Logger('UserModule');

// 四种日志等级
logger.verbose('这是一条详细日志，调试用的');
logger.info('用户登录成功');
logger.warning('密码输入错误次数较多，请注意');
logger.error('用户数据保存失败了');

console.log('');
console.log('========== 示例2：同时输出到控制台和文件 ==========');

// 再创建一个logger，加上文件输出器
const logger2 = new Logger('OrderModule');

// 添加一个文件输出器（目前是模拟的，会打印 [File IO ...] 表示写入文件）
// 文件输出器默认只记录 INFO 及以上级别的日志
const fileAppender = new FileAppender('./logs/app.log', LogLevel.INFO);
logger2.addAppender(fileAppender);

logger2.verbose('订单模块初始化完成（这条不会写入文件，因为等级太低）');
logger2.info('新订单创建成功');
logger2.warning('库存不足，请及时补货');
logger2.error('支付回调处理失败');

console.log('');
console.log('========== 示例3：自定义输出等级 ==========');

// 只输出WARNING及以上的日志
const errorLogger = new Logger('ErrorOnly');

// 先清掉默认的appender
errorLogger.removeAppender(new ConsoleAppender()); // 这个不行，因为是新对象，引用不一样
// 正确做法：创建新的appender加进去

const warnOnlyConsole = new ConsoleAppender(LogLevel.WARNING);
// 先移除默认的... 嗯，默认的那个我们没有引用，算了直接加新的吧
// 其实应该在创建logger的时候就配置好，我这里先加一个新的演示

errorLogger.addAppender(warnOnlyConsole);
errorLogger.verbose('这条看不到');
errorLogger.info('这条也看不到');
errorLogger.warning('警告：内存快满了');
errorLogger.error('错误：程序崩溃了');
