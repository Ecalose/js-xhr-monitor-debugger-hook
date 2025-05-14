import { XhrContext } from "../context/xhr-context";
import Logger from "../logger/logger";

/**
 * 调试器测试类
 */
export class DebuggerTester {
    /**
     * 测试调试器
     * @param xhrContext XHR上下文对象
     */
    static test(xhrContext: XhrContext): void {
        // 在此处添加测试逻辑
        Logger.group('调试器测试', () => {
            Logger.info('测试上下文:', xhrContext);
            Logger.debug('URL:', xhrContext.requestContext.urlContext.rawUrl);
            Logger.debug('方法:', xhrContext.requestContext.method);
            
            // 请求头
            const requestHeaders = xhrContext.requestContext.headerContext.getAll();
            if (requestHeaders && requestHeaders.length > 0) {
                Logger.debug('请求头:');
                Logger.dir(requestHeaders);
            }
            
            // 响应头
            const responseHeaders = xhrContext.responseContext.headerContext.getAll();
            if (responseHeaders && responseHeaders.length > 0) {
                Logger.debug('响应头:');
                Logger.dir(responseHeaders);
            }

            // 请求体
            const requestBody = xhrContext.requestContext.bodyContext.getRawBodyPlain();
            if (requestBody) {
                Logger.debug('请求体:');
                Logger.info(requestBody);
            }

            // 响应体
            const responseBody = xhrContext.responseContext.bodyContext.getRawBodyPlain();
            if (responseBody) {
                Logger.debug('响应体:');
                Logger.info(responseBody);
            }
        });
    }
} 