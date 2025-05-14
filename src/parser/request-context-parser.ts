import { UrlContextParser } from "./url-context-parser";
import { RequestContext } from "../context/request-context";

/**
 * 请求上下文解析器
 * 
 * 用于解析和管理HTTP请求的上下文信息。
 * 该解析器负责从URL中提取信息并更新请求上下文，是构建完整请求信息的重要环节。
 * 通过委托给UrlContextParser来实现URL的具体解析功能。
 * 
 * @example
 * // 使用示例
 * const parser = new RequestContextParser();
 * const requestContext = new RequestContext();
 * parser.updateWithUrl(requestContext, 'https://api.example.com/data?id=123');
 * // requestContext.urlContext会被更新，包含URL各部分的信息
 */
export class RequestContextParser {
    /**
     * 使用URL更新请求上下文
     * 
     * 解析提供的URL并更新请求上下文中的URL相关信息。
     * 该方法会创建一个新的UrlContextParser实例来解析URL，
     * 并将解析结果设置到请求上下文的urlContext属性中。
     * 
     * @param requestContext {RequestContext} 请求上下文 - 要更新的请求上下文对象
     * @param url {string} URL字符串 - 要解析的URL，如"https://api.example.com/users?id=123"
     * 
     * @example
     * // URL更新示例
     * const requestContext = new RequestContext();
     * updateWithUrl(requestContext, 'https://api.example.com/products?category=electronics&sort=price');
     * 
     * // 执行后，requestContext.urlContext将包含以下信息
     * // domain: "api.example.com"
     * // protocol: "https"
     * // requestPath: "/products"
     * // queryString: "?category=electronics&sort=price"
     * // params: [
     * //   {name: "category", value: "electronics", paramType: ParamType.URL, paramLocation: ContextLocation.REQUEST},
     * //   {name: "sort", value: "price", paramType: ParamType.URL, paramLocation: ContextLocation.REQUEST}
     * // ]
     */
    updateWithUrl(requestContext: RequestContext, url: string): void {
        requestContext.urlContext = new UrlContextParser().parse(url);
    }
} 