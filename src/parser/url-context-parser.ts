import { UrlContext } from "../context/url-context";
import { Param } from "../context/param";
import { ParamType } from "../context/param-type";
import { ContextLocation } from "../context/context-location";
import Logger from "../logger";

/**
 * URL上下文解析器
 * 
 * 负责解析URL字符串，提取其中的各个组成部分，如域名、协议、路径、查询参数等。
 * 解析结果会被封装到UrlContext对象中，便于后续处理和分析。
 * 该解析器是处理HTTP请求URL的基础组件，为监控和调试提供重要信息。
 * 
 * @example
 * // 使用示例
 * const parser = new UrlContextParser();
 * const urlContext = parser.parse('https://api.example.com/users?id=123&role=admin');
 * console.log(urlContext.domain); // 输出: api.example.com
 * console.log(urlContext.protocol); // 输出: https
 * console.log(urlContext.params); // 输出: [{name: "id", value: "123"}, {name: "role", value: "admin"}]
 */
export class UrlContextParser {
    /**
     * 解析URL并返回一个包含提取组件的UrlContext对象
     * 
     * 将URL字符串分解为各个组成部分：域名、端口、协议、路径、查询参数等，
     * 并将这些信息存储在UrlContext对象中。如果传入无效URL，会返回一个空的UrlContext对象。
     * 对于查询参数，每个参数都会被解析成Param对象并存储在params数组中。
     * 
     * @param {string} url - 需要解析的URL字符串，如"https://example.com/path?query=value"
     * @return {UrlContext} - 包含解析结果的UrlContext对象，其中包含域名、端口、协议、路径、查询参数等信息
     * 
     * @example
     * // 解析完整URL示例
     * const url = 'https://api.example.com:8443/products/123?format=json&version=2';
     * const context = parse(url);
     * 
     * // 输出结果示例：
     * // context.rawUrl = 'https://api.example.com:8443/products/123?format=json&version=2'
     * // context.domain = 'api.example.com'
     * // context.port = 8443
     * // context.protocol = 'https'
     * // context.requestPath = '/products/123'
     * // context.queryString = '?format=json&version=2'
     * // context.params = [
     * //   {name: "format", value: "json", paramType: ParamType.URL, paramLocation: ContextLocation.REQUEST},
     * //   {name: "version", value: "2", paramType: ParamType.URL, paramLocation: ContextLocation.REQUEST}
     * // ]
     * 
     * @example
     * // 解析简单URL示例
     * const url = 'https://example.com';
     * const context = parse(url);
     * // context.domain = 'example.com'
     * // context.port = 443
     * // context.protocol = 'https'
     * // context.requestPath = '/'
     * // context.params = []
     * 
     * @throws {Error} 如果URL格式无效，可能会抛出异常。函数内部会尝试用try-catch捕获这些异常。
     */
    parse(url: string): UrlContext {
        const urlContext = new UrlContext();

        // 有可能是非法的空的字符串，比如响应失败之类的
        if (!url) {
            return urlContext;
        }

        try {
            // 使用URL类解析URL
            const parsedUrl = new URL(url);

            urlContext.rawUrl = url;

            // 提取并设置域名
            urlContext.domain = parsedUrl.hostname;

            // 提取并设置端口
            urlContext.port = parsedUrl.port ? parseInt(parsedUrl.port) : (parsedUrl.protocol === 'https:' ? 443 : 80);

            // 提取并设置协议
            urlContext.protocol = parsedUrl.protocol.replace(':', '');

            // 提取并设置查询字符串
            urlContext.queryString = parsedUrl.search;

            // 提取并设置请求路径
            urlContext.requestPath = parsedUrl.pathname;

            // 提取并设置参数
            urlContext.params = [];
            parsedUrl.searchParams.forEach((value, key) => {
                const param = new Param();
                param.paramType = ParamType.URL; // 参数类型为 URL
                param.paramLocation = ContextLocation.REQUEST; // 参数位置为 REQUEST
                param.name = key; // 参数名称
                param.value = value; // 参数值
                urlContext.params.push(param);
            });
        } catch (error) {
            Logger.error('解析URL出错:', error);
            // 发生错误时返回空的上下文对象
        }

        return urlContext;
    }
} 