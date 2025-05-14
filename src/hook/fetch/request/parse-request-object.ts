import { FetchContext } from '../../../context/fetch-context';
import { RequestBodyParser } from '../../../parser/request-body-parser';
import Logger from '../../../logger';
import { updateUrlContext } from './update-url-context';
import { FetchErrorType, createErrorContext, logFetchError } from '../logger/error-logger';

/**
 * 解析请求方法
 * @param fetchContext fetch上下文
 * @param request Request对象
 */
export function parseRequestMethod(fetchContext: FetchContext, request: Request): void {
    fetchContext.requestContext.method = request.method;
}

/**
 * 解析Request对象中的请求头
 * @param fetchContext fetch上下文
 * @param request Request对象
 */
export function parseRequestObjectHeaders(fetchContext: FetchContext, request: Request): void {
    request.headers.forEach((value, key) => {
        fetchContext.requestContext.headerContext.add(key, value);
    });
}

/**
 * 异步解析Request对象中的请求体
 * @param fetchContext fetch上下文
 * @param request Request对象
 */
export function parseRequestObjectBody(fetchContext: FetchContext, request: Request): void {
    // 只有特定方法才解析请求体
    if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
        return;
    }
    
    // 克隆请求以便可以多次读取
    request.clone().text().then(body => {
        try {
            if (body) {
                const bodyParser = new RequestBodyParser();
                fetchContext.requestContext.bodyContext = bodyParser.parse(body);
            }
        } catch (error) {
            const errorContext = createErrorContext(
                fetchContext,
                FetchErrorType.REQUEST_BODY_PARSING,
                {
                    method: request.method,
                    url: request.url,
                    bodyLength: body ? body.length : 0,
                    bodyPreview: body ? body.substring(0, 100) + (body.length > 100 ? '...' : '') : ''
                }
            );
            
            logFetchError('解析Request对象请求体失败', error, errorContext);
        }
    }).catch(error => {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_BODY_PARSING,
            {
                method: request.method,
                url: request.url,
                error: 'Failed to read request body'
            }
        );
        
        logFetchError('读取Request对象请求体失败', error, errorContext);
    });
}

/**
 * 解析Request对象
 * @param fetchContext fetch上下文
 * @param request Request对象
 */
export function parseRequestObject(fetchContext: FetchContext, request: Request): void {
    try {
        // 保存原始请求
        fetchContext.originalRequest = request.clone();
        
        // 解析URL
        const url = request.url;
        updateUrlContext(fetchContext, url);
        
        // 解析请求方法
        parseRequestMethod(fetchContext, request);
        
        // 解析请求头
        parseRequestObjectHeaders(fetchContext, request);
        
        // 解析请求体
        parseRequestObjectBody(fetchContext, request);
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_OBJECT_PARSING,
            {
                url: request.url,
                method: request.method,
                hasBody: !!request.body
            }
        );
        
        logFetchError('解析Request对象失败', error, errorContext);
    }
} 