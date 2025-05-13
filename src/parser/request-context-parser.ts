import { UrlContextParser } from "./url-context-parser";
import { RequestContext } from "../context/request-context";

/**
 * 请求上下文解析器
 */
export class RequestContextParser {
    /**
     * 使用URL更新请求上下文
     * @param requestContext {RequestContext} 请求上下文
     * @param url {string} URL字符串
     */
    updateWithUrl(requestContext: RequestContext, url: string): void {
        requestContext.urlContext = new UrlContextParser().parse(url);
    }
} 