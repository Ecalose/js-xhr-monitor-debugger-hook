import { FetchContext } from '../../../context/fetch-context';
import { Param } from '../../../context/param';
import { ParamType } from '../../../context/param-type';
import { ContextLocation } from '../../../context/context-location';
import Logger from '../../../logger';

/**
 * 更新URL上下文
 * @param fetchContext fetch上下文
 * @param url URL字符串
 */
export function updateUrlContext(fetchContext: FetchContext, url: string): void {
    try {
        const parsedUrl = new URL(url);
        fetchContext.requestContext.urlContext.rawUrl = url;
        fetchContext.requestContext.urlContext.domain = parsedUrl.hostname;
        fetchContext.requestContext.urlContext.port = parsedUrl.port ? 
            parseInt(parsedUrl.port) : 
            (parsedUrl.protocol === 'https:' ? 443 : 80);
        fetchContext.requestContext.urlContext.protocol = parsedUrl.protocol.replace(':', '');
        fetchContext.requestContext.urlContext.queryString = parsedUrl.search;
        fetchContext.requestContext.urlContext.requestPath = parsedUrl.pathname;
        
        // 处理查询参数
        parsedUrl.searchParams.forEach((value, key) => {
            const param = new Param();
            param.name = key;
            param.value = value;
            param.paramType = "URL";
            param.paramLocation = ContextLocation.REQUEST;
            fetchContext.requestContext.urlContext.params.push(param);
        });
    } catch (error) {
        Logger.error('Error parsing URL:', error);
    }
} 