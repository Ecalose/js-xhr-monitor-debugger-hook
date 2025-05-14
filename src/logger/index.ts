/**
 * 日志模块入口文件
 * 提供日志配置和常用导出
 */
import Logger, { LogLevel, LoggerConfig } from './logger';

/**
 * 初始化项目日志记录器
 * 可以在这里根据环境变量或其他配置来确定日志级别
 */
export function initLogger(): void {
    // 判断是否为开发环境
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // 开发环境使用DEBUG级别，生产环境使用INFO级别
    const config: Partial<LoggerConfig> = {
        level: isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
        // 可以在此处添加其他配置项
    };
    
    Logger.configure(config);
    
    // 输出初始化日志
    Logger.info(`日志系统初始化完成，当前级别: ${LogLevel[config.level || LogLevel.INFO]}`);
}

// 用法示例：
/* 
// 基本使用
Logger.debug('这是一条调试信息'); // 仅在调试级别或以下显示
Logger.info('这是一条信息');
Logger.warn('这是一条警告');
Logger.error('这是一条错误', new Error('发生错误'));

// 对象输出
const data = { user: 'admin', id: 123 };
Logger.dir(data, '用户数据');

// 分组输出
Logger.group('API调用', () => {
    Logger.info('请求URL:', '/api/data');
    Logger.info('请求方法:', 'GET');
    Logger.info('响应状态:', 200);
});

// 性能计时
Logger.time('数据处理');
// ... 执行一些操作
Logger.timeEnd('数据处理');

// 临时修改配置
const originalConfig = Logger.getConfig();
Logger.configure({ level: LogLevel.DEBUG });
// ... 执行需要详细日志的操作
Logger.configure(originalConfig); // 恢复原配置
*/

// 导出日志工具
export { Logger, LogLevel, LoggerConfig };
export default Logger; 