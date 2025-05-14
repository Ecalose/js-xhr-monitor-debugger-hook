import { FetchContext } from '../../../context/fetch-context';
import { RequestBodyParser } from '../../../parser/request-body-parser';
import Logger from '../../../logger';
import { FetchErrorType, createErrorContext, logFetchError } from '../logger/error-logger';

/**
 * 处理标准请求体
 * @param bodyParser 请求体解析器
 * @param body 请求体
 * @returns 处理后的请求体
 */
export function processStandardBody(bodyParser: RequestBodyParser, body: BodyInit): any {
    return body;
}

/**
 * 处理ReadableStream类型的请求体
 * 由于ReadableStream不能直接解析，需要特殊处理
 * @param bodyParser 请求体解析器
 * @param body ReadableStream请求体
 * @returns 处理后的请求体（简化为空字符串）
 */
export function processReadableStreamBody(bodyParser: RequestBodyParser, body: ReadableStream): any {
    Logger.warn('ReadableStream请求体类型不能直接解析');
    return ''; // 简化处理，使用空字符串作为占位符
}

/**
 * 根据请求体类型选择合适的处理函数
 * @param body 请求体
 * @returns 处理函数
 */
export function selectBodyProcessor(body: BodyInit): (bodyParser: RequestBodyParser, body: any) => any {
    if (body instanceof ReadableStream) {
        return processReadableStreamBody;
    }
    return processStandardBody;
}

/**
 * 解析请求体
 * @param fetchContext fetch上下文
 * @param body 请求体
 */
export function parseRequestBody(fetchContext: FetchContext, body: BodyInit): void {
    try {
        const bodyParser = new RequestBodyParser();
        
        // 根据请求体类型选择处理函数
        const processor = selectBodyProcessor(body);
        
        // 处理请求体
        const processedBody = processor(bodyParser, body);
        
        // 解析处理后的请求体
        fetchContext.requestContext.bodyContext = bodyParser.parse(processedBody);
    } catch (error) {
        const bodyType = body instanceof ReadableStream ? 'ReadableStream' :
                       body instanceof Blob ? 'Blob' :
                       body instanceof ArrayBuffer ? 'ArrayBuffer' :
                       body instanceof FormData ? 'FormData' :
                       body instanceof URLSearchParams ? 'URLSearchParams' :
                       typeof body === 'string' ? 'string' : 'unknown';

        const errorContext = createErrorContext(
            fetchContext,
            FetchErrorType.REQUEST_BODY_PARSING,
            {
                bodyType: bodyType,
                method: fetchContext.requestContext.method,
                url: fetchContext.requestContext.urlContext.rawUrl,
                bodyPreview: typeof body === 'string' ? 
                    (body.length > 100 ? body.substring(0, 100) + '...' : body) : 
                    null
            }
        );
        
        logFetchError('解析请求体失败', error, errorContext);
    }
} 