import { FetchContext } from '../../../context/fetch-context';
import Logger from '../../../logger';
import { FetchErrorType, createErrorContext, logFetchError } from '../logger/error-logger';

/**
 * 解析Headers类型的请求头
 * @param fetchContext fetch上下文
 * @param headers Headers对象
 */
export function parseHeadersObject(fetchContext: FetchContext, headers: Headers): void {
    try {
        headers.forEach((value, key) => {
            fetchContext.requestContext.headerContext.add(key, value);
        });
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_HEADERS_PARSING,
            {
                headerType: 'Headers',
                headersSize: headers ? countHeaders(headers) : 0
            }
        );
        
        logFetchError('解析Headers对象请求头失败', error, errorContext);
    }
}

/**
 * 解析数组类型的请求头
 * @param fetchContext fetch上下文
 * @param headers 请求头数组，形如[[key, value], ...]
 */
export function parseHeadersArray(fetchContext: FetchContext, headers: string[][]): void {
    try {
        for (const [key, value] of headers) {
            fetchContext.requestContext.headerContext.add(key, value);
        }
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_HEADERS_PARSING,
            {
                headerType: 'Array',
                headersSize: headers ? headers.length : 0,
                headersPreview: headers ? JSON.stringify(headers.slice(0, 3)) : null
            }
        );
        
        logFetchError('解析数组类型请求头失败', error, errorContext);
    }
}

/**
 * 解析对象类型的请求头
 * @param fetchContext fetch上下文
 * @param headers 请求头对象，形如{key: value, ...}
 */
export function parseHeadersRecord(fetchContext: FetchContext, headers: Record<string, string>): void {
    try {
        for (const key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key)) {
                fetchContext.requestContext.headerContext.add(key, headers[key]);
            }
        }
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_HEADERS_PARSING,
            {
                headerType: 'Object',
                headersSize: headers ? Object.keys(headers).length : 0,
                headerKeys: headers ? Object.keys(headers).slice(0, 5) : null
            }
        );
        
        logFetchError('解析对象类型请求头失败', error, errorContext);
    }
}

/**
 * 计算Headers对象中的头部数量
 * @param headers Headers对象
 * @returns 头部数量
 */
function countHeaders(headers: Headers): number {
    let count = 0;
    headers.forEach(() => count++);
    return count;
}

/**
 * 解析请求头
 * @param fetchContext fetch上下文
 * @param headers 请求头对象
 */
export function parseRequestHeaders(fetchContext: FetchContext, headers: HeadersInit): void {
    try {
        if (headers instanceof Headers) {
            parseHeadersObject(fetchContext, headers);
        } else if (Array.isArray(headers)) {
            parseHeadersArray(fetchContext, headers);
        } else if (typeof headers === 'object') {
            parseHeadersRecord(fetchContext, headers);
        }
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_HEADERS_PARSING,
            {
                headerType: headers instanceof Headers ? 'Headers' :
                            Array.isArray(headers) ? 'Array' :
                            typeof headers === 'object' ? 'Object' : 'Unknown'
            }
        );
        
        logFetchError('解析请求头失败', error, errorContext);
    }
} 