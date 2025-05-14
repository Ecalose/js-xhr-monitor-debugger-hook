import { ancestorFetchHolder } from './holder';
import { FetchContext } from '../../context/fetch-context';
import { getUnsafeWindow } from '../../utils/unsafe-window';
import Logger from '../../logger';
import { parseRequestInfo } from './request/parse-request-info';
import { logRequest } from './logger/request-logger';
import { parseResponseHeaders } from './response/parse-response-headers';
import { parseResponseBody } from './response/parse-response-body';
import { logResponse } from './logger/response-logger';
import { FetchErrorType, createErrorContext, logFetchError } from './logger/error-logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * Fetch Hook类
 * 用于拦截和处理fetch请求
 */
export class FetchHook {
    
    /**
     * 添加fetch函数的hook
     */
    addHook(): void {
        const originalFetch = ancestorFetchHolder;
        
        // 重写全局fetch函数
        (getUnsafeWindow() as Window & typeof globalThis).fetch = function(
            input: RequestInfo | URL, 
            init?: RequestInit
        ): Promise<Response> {
            try {
                // 创建fetch上下文
                const fetchContext = new FetchContext();
                
                // 创建请求ID
                fetchContext.id = uuidv4();
                
                // 解析请求信息
                parseRequestInfo(fetchContext, input, init);
                
                // 打印请求信息
                logRequest(fetchContext);
                
                // 调用原始fetch并处理响应
                return originalFetch(input, init)
                    .then(response => {
                        // 克隆响应以便可以多次读取
                        const clonedResponse = response.clone();
                        fetchContext.originalResponse = clonedResponse;
                        
                        // 解析响应头信息
                        parseResponseHeaders(fetchContext, clonedResponse);
                        
                        // 解析响应状态
                        fetchContext.responseContext.statusCode = clonedResponse.status;
                        
                        // 打印响应信息
                        logResponse(fetchContext);
                        
                        // 处理响应体
                        return parseResponseBody(clonedResponse, fetchContext)
                            .then(bodyContext => {
                                if (bodyContext) {
                                    fetchContext.responseContext.bodyContext = bodyContext;
                                }
                                return response;
                            })
                            .catch((error) => {
                                // 使用增强的错误日志记录
                                const errorContext = createErrorContext(
                                    fetchContext,
                                    FetchErrorType.RESPONSE_BODY_PARSING,
                                    {
                                        url: fetchContext.requestContext.urlContext.rawUrl,
                                        method: fetchContext.requestContext.method,
                                        status: clonedResponse.status,
                                        statusText: clonedResponse.statusText
                                    }
                                );
                                
                                logFetchError('处理响应体时发生错误', error, errorContext);
                                
                                // 忽略解析错误，返回原始响应
                                return response;
                            });
                    })
                    .catch(error => {
                        // 记录请求错误
                        const errorContext = createErrorContext(
                            fetchContext,
                            FetchErrorType.EXECUTION,
                            {
                                url: fetchContext.requestContext.urlContext.rawUrl,
                                method: fetchContext.requestContext.method,
                                inputType: input instanceof Request ? 'Request' : 'URL'
                            }
                        );
                        
                        logFetchError('Fetch请求执行失败', error, errorContext);
                        throw error; // 重新抛出错误以不影响原始行为
                    });
            } catch (error) {
                // 创建错误上下文（没有fetchContext）
                const errorContext = createErrorContext(
                    null,
                    FetchErrorType.UNKNOWN,
                    {
                        inputType: input instanceof Request ? 'Request' : 'URL',
                        inputUrl: input instanceof Request ? input.url : 
                                (typeof input === 'string' ? input : input.toString()),
                        hasInit: !!init
                    }
                );
                
                logFetchError('Fetch hook处理时发生未知错误', error, errorContext);
                
                // 出错时调用原始fetch以保持功能正常
                return originalFetch(input, init);
            }
        };
    }
} 