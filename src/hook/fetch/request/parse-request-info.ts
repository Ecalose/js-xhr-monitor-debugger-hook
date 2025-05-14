import { FetchContext } from '../../../context/fetch-context';
import Logger from '../../../logger';
import { parseRequestObject } from './parse-request-object';
import { parseRequestUrl } from './parse-request-url';
import { FetchErrorType, createErrorContext, logFetchError } from '../logger/error-logger';

/**
 * 解析请求信息
 * 
 * 根据输入类型（Request对象或URL字符串）选择相应的解析函数
 * 
 * @param fetchContext fetch上下文
 * @param input 请求资源（Request对象或URL字符串）
 * @param init 请求配置
 */
export function parseRequestInfo(fetchContext: FetchContext, input: RequestInfo | URL, init?: RequestInit): void {
    try {
        // 根据输入类型选择不同的解析函数
        if (input instanceof Request) {
            // 如果input是Request对象
            parseRequestObject(fetchContext, input);
        } else {
            // 如果input是URL字符串
            parseRequestUrl(fetchContext, input, init);
        }
    } catch (error) {
        // 创建详细的错误上下文
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_PARSING,
            {
                inputType: input instanceof Request ? 'Request' : 'URL',
                hasInit: !!init
            }
        );
        
        // 使用增强的错误日志记录
        logFetchError('解析请求信息失败', error, errorContext);
    }
} 