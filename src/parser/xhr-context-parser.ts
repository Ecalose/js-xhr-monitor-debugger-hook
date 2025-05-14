import { XhrContext } from "../context/xhr-context";
import { RequestContextParser } from "./request-context-parser";

/**
 * XHR上下文解析器
 * 
 * 用于处理和解析XMLHttpRequest(XHR)的上下文信息。
 * 该解析器主要负责更新XHR上下文中的URL相关信息，通过委托给RequestContextParser来完成实际的URL解析工作。
 * 这是XHR拦截和监控系统的重要组成部分，用于提取和组织请求的详细信息。
 * 
 * @example
 * // 使用示例
 * const parser = new XhrContextParser();
 * const xhrContext = new XhrContext();
 * parser.updateWithUrl(xhrContext, 'https://api.example.com/users?id=123');
 * // xhrContext.requestContext.urlContext 会被更新，包含URL的各个组成部分
 */
export class XhrContextParser {
    /**
     * 使用URL更新XHR上下文
     * 
     * 通过提供的URL更新XHR上下文中的请求信息。
     * 该方法会解析URL并提取域名、路径、查询参数等信息，并将其存储在XHR上下文的请求上下文中。
     * 内部委托给RequestContextParser的updateWithUrl方法来完成实际的解析工作。
     * 
     * @param xhrContext {XhrContext} XHR上下文 - 要更新的XMLHttpRequest上下文对象
     * @param url {string} URL字符串 - 要解析的完整URL，如"https://example.com/api?key=value"
     * 
     * @example
     * // 更新上下文示例
     * const xhrContext = new XhrContext();
     * updateWithUrl(xhrContext, 'https://api.example.com/data?sort=desc&page=1');
     * 
     * // 更新后的xhrContext.requestContext.urlContext可能包含
     * // domain: "api.example.com"
     * // protocol: "https"
     * // requestPath: "/data"
     * // queryString: "sort=desc&page=1"
     * // params: [{name: "sort", value: "desc"}, {name: "page", value: "1"}]
     */
    updateWithUrl(xhrContext: XhrContext, url: string): void {
        new RequestContextParser().updateWithUrl(xhrContext.requestContext, url);
    }
} 