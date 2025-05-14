import { FetchContext } from '../../../context/fetch-context';
import Logger from '../../../logger';

/**
 * 打印请求信息
 * @param fetchContext fetch上下文
 */
export function logRequest(fetchContext: FetchContext): void {
    Logger.info(
        `[Fetch Request] ${fetchContext.requestContext.method} ${fetchContext.requestContext.urlContext.rawUrl}`
    );
    
    // 打印请求头
    const headers = fetchContext.requestContext.headerContext.getAll();
    if (headers.length > 0) {
        Logger.group('Headers', () => {
            headers.forEach(header => {
                Logger.info(`${header.name}: ${header.value}`);
            });
        });
    }
    
    // 打印请求体
    if (fetchContext.requestContext.bodyContext?.rawBody) {
        Logger.info('Body:', fetchContext.requestContext.bodyContext.rawBody);
    }
} 