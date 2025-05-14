import { FetchContext } from '../../../context/fetch-context';
import Logger from '../../../logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * 错误类型枚举
 */
export enum FetchErrorType {
    REQUEST_PARSING = 'REQUEST_PARSING',
    REQUEST_HEADERS_PARSING = 'REQUEST_HEADERS_PARSING',
    REQUEST_BODY_PARSING = 'REQUEST_BODY_PARSING',
    REQUEST_OBJECT_PARSING = 'REQUEST_OBJECT_PARSING',
    URL_PARSING = 'URL_PARSING',
    RESPONSE_PARSING = 'RESPONSE_PARSING',
    RESPONSE_HEADERS_PARSING = 'RESPONSE_HEADERS_PARSING',
    RESPONSE_BODY_PARSING = 'RESPONSE_BODY_PARSING',
    EXECUTION = 'EXECUTION',
    UNKNOWN = 'UNKNOWN'
}

/**
 * 错误上下文接口
 */
export interface ErrorContext {
    url?: string;
    method?: string;
    requestId: string;
    timestamp: number;
    errorType: FetchErrorType;
    additionalInfo?: Record<string, any>;
}

/**
 * 创建错误上下文
 * @param fetchContext fetch上下文
 * @param errorType 错误类型
 * @param additionalInfo 附加信息
 * @returns 错误上下文
 */
export function createErrorContext(
    fetchContext: FetchContext | null, 
    errorType: FetchErrorType,
    additionalInfo?: Record<string, any>
): ErrorContext {
    const context: ErrorContext = {
        timestamp: Date.now(),
        errorType,
        requestId: fetchContext?.id || uuidv4() // 使用fetchContext的id或者生成新ID
    };
    
    if (fetchContext) {
        context.url = fetchContext.requestContext.urlContext.rawUrl || undefined;
        context.method = fetchContext.requestContext.method || undefined;
    }
    
    if (additionalInfo) {
        context.additionalInfo = additionalInfo;
    }
    
    return context;
}

/**
 * 格式化错误上下文为日志消息
 * @param context 错误上下文
 * @returns 格式化的日志消息
 */
function formatErrorContext(context: ErrorContext): string {
    const parts = [
        `错误类型: ${context.errorType}`,
    ];
    
    if (context.requestId) {
        parts.push(`请求ID: ${context.requestId}`);
    }
    
    if (context.url) {
        parts.push(`URL: ${context.url}`);
    }
    
    if (context.method) {
        parts.push(`方法: ${context.method}`);
    }
    
    return parts.join(' | ');
}

/**
 * 记录详细的错误信息
 * @param message 错误消息
 * @param error 错误对象
 * @param context 错误上下文
 */
export function logFetchError(
    message: string,
    error: Error | unknown,
    context: ErrorContext
): void {
    const formattedContext = formatErrorContext(context);
    const errorInfo = error instanceof Error 
        ? { name: error.name, message: error.message, stack: error.stack } 
        : error;
    
    Logger.group(`Fetch错误: ${message}`, () => {
        Logger.error(`${formattedContext}`);
        
        if (context.additionalInfo) {
            Logger.error('附加信息:', context.additionalInfo);
        }
        
        Logger.error('错误详情:', errorInfo);
        
        // 如果有堆栈，单独记录，提高可读性
        if (error instanceof Error && error.stack) {
            Logger.error('堆栈跟踪:');
            const stackLines = error.stack.split('\n');
            stackLines.forEach(line => Logger.error('  ', line));
        }
    });
} 