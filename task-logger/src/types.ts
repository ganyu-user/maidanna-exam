// 日志等级枚举
// 从小到大：verbose < info < warning < error
export enum LogLevel {
    VERBOSE = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3
}

// 日志消息的结构
export interface LogMessage {
    level: LogLevel;
    message: string;
    timestamp: Date;
    // 可选的标签，方便分类查找
    tag?: string;
}

// 日志输出的接口
// 以后要加新的输出方式（比如文件、网络），实现这个接口就行
export interface LogAppender {
    append(logMessage: LogMessage): void;
}
