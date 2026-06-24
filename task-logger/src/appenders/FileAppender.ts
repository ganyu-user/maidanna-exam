import { LogAppender, LogMessage, LogLevel } from '../types';

// 模拟文件写入的函数
// 等以后真正做文件I/O的时候，把这个换成真实的fs操作就行
function NativeFileWriteSync(filePath: string, buffer: string): void {
    console.log(`[File IO ${filePath}] ${buffer}`);
}

// 文件输出器
// 把日志写入到文件中（目前是模拟的）
export class FileAppender implements LogAppender {
    private filePath: string;
    private minLevel: LogLevel;

    constructor(filePath: string, minLevel: LogLevel = LogLevel.INFO) {
        this.filePath = filePath;
        this.minLevel = minLevel;
    }

    append(logMessage: LogMessage): void {
        // 低于最低等级的不写
        if (logMessage.level < this.minLevel) {
            return;
        }

        const timeStr = this.formatTime(logMessage.timestamp);
        const levelStr = this.getLevelString(logMessage.level);
        const tagStr = logMessage.tag ? `[${logMessage.tag}]` : '';

        const logLine = `[${timeStr}] [${levelStr}] ${tagStr} ${logMessage.message}\n`;

        // 调用模拟的文件写入方法
        NativeFileWriteSync(this.filePath, logLine);
    }

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
