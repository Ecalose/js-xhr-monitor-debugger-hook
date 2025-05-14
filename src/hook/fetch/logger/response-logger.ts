import { FetchContext } from '../../../context/fetch-context';
import Logger from '../../../logger';

/**
 * 打印响应信息
 * @param fetchContext fetch上下文
 */
export function logResponse(fetchContext: FetchContext): void {
    Logger.info(
        `[Fetch Response] ${fetchContext.responseContext.statusCode} for ${fetchContext.requestContext.urlContext.rawUrl}`
    );
    
    // 打印响应头
    const headers = fetchContext.responseContext.headerContext.getAll();
    if (headers.length > 0) {
        Logger.group('Headers', () => {
            headers.forEach(header => {
                Logger.info(`${header.name}: ${header.value}`);
            });
        });
    }
} 