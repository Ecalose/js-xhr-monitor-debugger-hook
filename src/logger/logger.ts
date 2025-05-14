/**
 * 全局日志模块
 * 提供统一的日志输出接口，代替直接使用console方法
 */

/**
 * 日志级别枚举
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 999 // 完全禁用日志
}

/**
 * 日志配置接口
 */
export interface LoggerConfig {
    level: LogLevel;
    prefix: string;
    showTimestamp: boolean;
    showLevel: boolean;
    enabled: boolean;
}

/**
 * 默认日志配置
 */
const defaultConfig: LoggerConfig = {
    level: LogLevel.INFO,
    prefix: '[JS-XHR-HOOK]',
    showTimestamp: true,
    showLevel: true,
    enabled: true
};

/**
 * 当前日志配置
 */
let currentConfig: LoggerConfig = { ...defaultConfig };

/**
 * 格式化日期时间
 * @param date 日期对象
 * @returns 格式化后的日期时间字符串
 */
function formatDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * 创建日志前缀
 * @param level 日志级别
 * @returns 格式化的日志前缀
 */
function createPrefix(level: LogLevel): string {
    const parts: string[] = [];
    
    if (currentConfig.prefix) {
        parts.push(currentConfig.prefix);
    }
    
    if (currentConfig.showTimestamp) {
        parts.push(formatDate(new Date()));
    }
    
    if (currentConfig.showLevel) {
        let levelStr = '';
        switch (level) {
            case LogLevel.DEBUG:
                levelStr = 'DEBUG';
                break;
            case LogLevel.INFO:
                levelStr = 'INFO';
                break;
            case LogLevel.WARN:
                levelStr = 'WARN';
                break;
            case LogLevel.ERROR:
                levelStr = 'ERROR';
                break;
        }
        
        if (levelStr) {
            parts.push(levelStr);
        }
    }
    
    return parts.join(' ');
}

/**
 * 日志记录器类
 */
export class Logger {
    /**
     * 配置日志记录器
     * @param config 日志配置
     */
    static configure(config: Partial<LoggerConfig>): void {
        currentConfig = { ...currentConfig, ...config };
    }
    
    /**
     * 重置为默认配置
     */
    static resetConfig(): void {
        currentConfig = { ...defaultConfig };
    }
    
    /**
     * 获取当前配置
     */
    static getConfig(): LoggerConfig {
        return { ...currentConfig };
    }
    
    /**
     * 记录调试日志
     * @param args 日志参数
     */
    static debug(...args: any[]): void {
        if (!currentConfig.enabled || currentConfig.level > LogLevel.DEBUG) {
            return;
        }
        
        console.debug(createPrefix(LogLevel.DEBUG), ...args);
    }
    
    /**
     * 记录信息日志
     * @param args 日志参数
     */
    static info(...args: any[]): void {
        if (!currentConfig.enabled || currentConfig.level > LogLevel.INFO) {
            return;
        }
        
        console.info(createPrefix(LogLevel.INFO), ...args);
    }
    
    /**
     * 记录警告日志
     * @param args 日志参数
     */
    static warn(...args: any[]): void {
        if (!currentConfig.enabled || currentConfig.level > LogLevel.WARN) {
            return;
        }
        
        console.warn(createPrefix(LogLevel.WARN), ...args);
    }
    
    /**
     * 记录错误日志
     * @param args 日志参数
     */
    static error(...args: any[]): void {
        if (!currentConfig.enabled || currentConfig.level > LogLevel.ERROR) {
            return;
        }
        
        console.error(createPrefix(LogLevel.ERROR), ...args);
    }
    
    /**
     * 记录对象的详细信息
     * @param obj 要记录的对象
     * @param title 可选标题
     */
    static dir(obj: any, title?: string): void {
        if (!currentConfig.enabled || currentConfig.level > LogLevel.DEBUG) {
            return;
        }
        
        if (title) {
            console.log(createPrefix(LogLevel.DEBUG), title);
        }
        
        console.dir(obj);
    }
    
    /**
     * 记录带分组的日志
     * @param groupName 分组名称
     * @param callback 分组内的回调函数
     */
    static group(groupName: string, callback: () => void): void {
        if (!currentConfig.enabled) {
            return;
        }
        
        console.group(createPrefix(LogLevel.INFO) + ' ' + groupName);
        callback();
        console.groupEnd();
    }
    
    /**
     * 计时操作
     * @param label 计时标签
     */
    static time(label: string): void {
        if (!currentConfig.enabled) {
            return;
        }
        
        console.time(currentConfig.prefix + ' ' + label);
    }
    
    /**
     * 结束计时操作
     * @param label 计时标签
     */
    static timeEnd(label: string): void {
        if (!currentConfig.enabled) {
            return;
        }
        
        console.timeEnd(currentConfig.prefix + ' ' + label);
    }
}

// 导出一个默认实例，方便直接使用
export default Logger;
