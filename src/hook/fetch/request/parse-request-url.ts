import { FetchContext } from '../../../context/fetch-context';
import { formatToUrl } from '../../../utils/url-util';
import Logger from '../../../logger';
import { updateUrlContext } from './update-url-context';
import { parseRequestHeaders } from './parse-request-headers';
import { parseRequestBody } from './parse-request-body';
import { FetchErrorType, createErrorContext, logFetchError } from '../logger/error-logger';

/**
 * 解析请求方法
 * @param fetchContext fetch上下文
 * @param method 请求方法
 */
export function parseMethodFromInit(fetchContext: FetchContext, method?: string): void {
    fetchContext.requestContext.method = (method || 'GET').toUpperCase();
}

/**
 * 解析URL字符串格式的请求
 * @param fetchContext fetch上下文
 * @param urlInfo URL字符串或URL对象
 * @param init 请求配置
 */
export function parseRequestUrl(fetchContext: FetchContext, urlInfo: string | URL, init?: RequestInit): void {
    try {
        // 格式化并解析URL
        const url = formatToUrl(urlInfo.toString());
        updateUrlContext(fetchContext, url);
        
        // 解析请求方法
        parseMethodFromInit(fetchContext, init?.method);
        
        // 解析请求头
        if (init?.headers) {
            parseRequestHeaders(fetchContext, init.headers);
        }
        
        // 解析请求体（如果有）
        const method = fetchContext.requestContext.method;
        if (init?.body && method && ['POST', 'PUT', 'PATCH'].includes(method)) {
            parseRequestBody(fetchContext, init.body);
        }
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.URL_PARSING,
            {
                urlInfo: typeof urlInfo === 'string' ? urlInfo : urlInfo.toString(),
                hasInit: !!init,
                initMethod: init?.method,
                hasBody: !!init?.body
            }
        );
        
        logFetchError('解析URL请求失败', error, errorContext);
    }
} 