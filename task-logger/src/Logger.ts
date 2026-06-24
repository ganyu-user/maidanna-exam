import { LogLevel, LogMessage, LogAppender } from './types';
import { ConsoleAppender } from './appenders/ConsoleAppender';

// Logger 主类
// 提供统一的日志写入接口
export class Logger {
    // 日志输出器列表，可以同时输出到多个地方
    private appenders: LogAppender[];
    // 日志标签，用来区分不同模块的日志
    private tag?: string;

    constructor(tag?: string) {
        this.tag = tag;
        this.appenders = [];

        // 默认加一个控制台输出器
        // 以后想加文件输出，调用 addAppender 就行
        const defaultConsoleAppender = new ConsoleAppender(LogLevel.VERBOSE);
        this.appenders.push(defaultConsoleAppender);
    }

    // 添加一个日志输出器
    addAppender(appender: LogAppender): void {
        this.appenders.push(appender);
    }

    // 移除一个日志输出器
    removeAppender(appender: LogAppender): void {
        const index = this.appenders.indexOf(appender);
        if (index > -1) {
            this.appenders.splice(index, 1);
        }
    }

    // 写 verbose 级别的日志
    verbose(message: string): void {
        this.log(LogLevel.VERBOSE, message);
    }

    // 写 info 级别的日志
    info(message: string): void {
        this.log(LogLevel.INFO, message);
    }

    // 写 warning 级别的日志
    warning(message: string): void {
        this.log(LogLevel.WARNING, message);
    }

    // 写 error 级别的日志
    error(message: string): void {
        this.log(LogLevel.ERROR, message);
    }

    // 内部统一的日志处理方法
    private log(level: LogLevel, message: string): void {
        const logMessage: LogMessage = {
            level: level,
            message: message,
            timestamp: new Date(),
            tag: this.tag
        };

        // 遍历所有输出器，把日志写出去
        for (const appender of this.appenders) {
            try {
                appender.append(logMessage);
            } catch (e) {
                // 如果某个输出器出错了，不要影响其他输出器
                // 这里直接用原生console打个错误，避免死循环
                console.error('Logger appender error:', e);
            }
        }
    }
}
