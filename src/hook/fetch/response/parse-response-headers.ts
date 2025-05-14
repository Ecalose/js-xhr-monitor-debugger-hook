import { FetchContext } from '../../../context/fetch-context';
import Logger from '../../../logger';
import { FetchErrorType, createErrorContext, logFetchError } from '../logger/error-logger';

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
 * 解析响应头信息
 * @param fetchContext fetch上下文
 * @param response 响应对象
 */
export function parseResponseHeaders(fetchContext: FetchContext, response: Response): void {
    try {
        response.headers.forEach((value, key) => {
            fetchContext.responseContext.headerContext.add(key, value);
        });
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.RESPONSE_HEADERS_PARSING,
            {
                url: fetchContext.requestContext.urlContext.rawUrl,
                method: fetchContext.requestContext.method,
                status: response.status,
                statusText: response.statusText,
                headersSize: countHeaders(response.headers)
            }
        );
        
        logFetchError('解析响应头失败', error, errorContext);
    }
} 