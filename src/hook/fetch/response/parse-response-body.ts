import { RequestBodyParser } from '../../../parser/request-body-parser';
import { BodyContext } from '../../../context/body-context';
import Logger from '../../../logger';
import { FetchContext } from '../../../context/fetch-context';
import { FetchErrorType, createErrorContext, logFetchError } from '../logger/error-logger';

/**
 * 解析响应体
 * @param response 响应对象
 * @param fetchContext fetch上下文，用于记录错误日志
 * @returns 解析后的响应体上下文
 */
export async function parseResponseBody(response: Response, fetchContext?: FetchContext): Promise<BodyContext | null> {
    // 根据响应类型选择不同的解析方式
    const contentType = response.headers.get('content-type') || '';
    
    try {
        if (contentType.includes('application/json')) {
            const text = await response.clone().text();
            const bodyParser = new RequestBodyParser();
            return bodyParser.parse(text);
        } else if (contentType.includes('text/')) {
            const text = await response.clone().text();
            const bodyParser = new RequestBodyParser();
            return bodyParser.parse(text);
        } else if (contentType.includes('multipart/form-data')) {
            // 处理表单数据
            const formData = await response.clone().formData();
            const bodyParser = new RequestBodyParser();
            return bodyParser.parse(formData);
        } else {
            // 处理二进制数据
            const blob = await response.clone().blob();
            const bodyParser = new RequestBodyParser();
            return bodyParser.parse(blob);
        }
    } catch (error) {
        const errorContext = createErrorContext(
            fetchContext || null,
            FetchErrorType.RESPONSE_BODY_PARSING,
            {
                url: fetchContext?.requestContext.urlContext.rawUrl,
                method: fetchContext?.requestContext.method,
                status: response.status,
                statusText: response.statusText,
                contentType: contentType,
                contentLength: response.headers.get('content-length'),
                responseType: response.type
            }
        );
        
        logFetchError('解析响应体失败', error, errorContext);
        return null;
    }
} 