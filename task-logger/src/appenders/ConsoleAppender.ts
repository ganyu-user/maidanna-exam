import { LogAppender, LogMessage, LogLevel } from '../types';

// 控制台输出器
// 把日志输出到浏览器/Node的console里
export class ConsoleAppender implements LogAppender {
    // 最低输出等级，低于这个等级的日志不输出
    private minLevel: LogLevel;

    constructor(minLevel: LogLevel = LogLevel.VERBOSE) {
        this.minLevel = minLevel;
    }

    append(logMessage: LogMessage): void {
        // 如果日志等级低于最低要求，就不输出
        if (logMessage.level < this.minLevel) {
            return;
        }

        // 格式化时间
        const timeStr = this.formatTime(logMessage.timestamp);
        const levelStr = this.getLevelString(logMessage.level);
        const tagStr = logMessage.tag ? `[${logMessage.tag}]` : '';

        // 根据不同等级调用不同的console方法
        switch (logMessage.level) {
            case LogLevel.VERBOSE:
                console.log(`[${timeStr}] [${levelStr}] ${tagStr} ${logMessage.message}`);
                break;
            case LogLevel.INFO:
                console.info(`[${timeStr}] [${levelStr}] ${tagStr} ${logMessage.message}`);
                break;
            case LogLevel.WARNING:
                console.warn(`[${timeStr}] [${levelStr}] ${tagStr} ${logMessage.message}`);
                break;
            case LogLevel.ERROR:
                console.error(`[${timeStr}] [${levelStr}] ${tagStr} ${logMessage.message}`);
                break;
        }
    }

    // 把日志等级转成字符串
    private getLevelString(level: LogLevel): string {
        switch (level) {
            case LogLevel.VERBOSE:
                return 'VERBOSE';
            case LogLevel.INFO:
                return 'INFO';
            case LogLevel.WARNING:
                return 'WARNING';
            case LogLevel.ERROR:
                return 'ERROR';
            default:
                return 'UNKNOWN';
        }
    }

    // 格式化时间：YYYY-MM-DD HH:mm:ss
    private formatTime(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
