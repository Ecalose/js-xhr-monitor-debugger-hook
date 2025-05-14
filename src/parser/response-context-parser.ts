import { ResponseContext } from "../context/response-context";
import { ResponseBodyParser } from "./response-body-parser";

/**
 * 响应上下文解析器
 * 
 * 用于从XMLHttpRequest对象中提取响应信息，并构建结构化的ResponseContext对象。
 * 该解析器是XHR监控系统中处理响应数据的重要组件，负责收集响应状态码、响应类型和响应体等信息。
 * 内部使用ResponseBodyParser来解析具体的响应体内容。
 * 
 * @example
 * // 使用示例
 * const parser = new ResponseContextParser();
 * const xhr = new XMLHttpRequest();
 * // ... 发送请求并接收响应 ...
 * const responseContext = parser.parse(xhr);
 * console.log(responseContext.statusCode); // 输出: 200
 */
export class ResponseContextParser {

    /**
     * 解析响应上下文
     * 
     * 从XMLHttpRequest对象中提取响应相关信息，包括状态码、响应类型和响应体。
     * 该方法会创建一个新的ResponseContext对象，填充从XHR对象获取的数据。
     * 响应体的解析会委托给ResponseBodyParser进行处理。
     * 
     * @param xhrObject {XMLHttpRequest} XHR对象 - 已完成请求的XMLHttpRequest对象
     * @returns {ResponseContext} 响应上下文 - 包含解析后的响应信息
     * 
     * @example
     * // 基本解析示例
     * const xhr = new XMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data', false);
     * xhr.send();
     * // 假设xhr请求已完成并收到响应
     * const responseContext = parse(xhr);
     * 
     * // 解析结果将包含:
     * // responseContext.statusCode = 200 (如果请求成功)
     * // responseContext.responseType = "" (默认) 或 "json", "text" 等
     * // responseContext.bodyContext 将包含解析后的响应体
     * 
     * @example
     * // 访问解析后的响应体示例
     * const responseContext = parse(xhr);
     * if (responseContext.bodyContext.contentType === ContentType.JSON) {
     *   console.log(responseContext.bodyContext.jsonData);
     * } else if (responseContext.statusCode === 404) {
     *   console.log("资源未找到");
     * }
     */
    parse(xhrObject: XMLHttpRequest): ResponseContext {
        const responseContext = new ResponseContext();

        // 设置响应状态码
        responseContext.statusCode = xhrObject.status;

        // 设置响应类型
        responseContext.responseType = xhrObject.responseType;

        // 解析响应体
        responseContext.bodyContext = new ResponseBodyParser().parse(xhrObject);

        return responseContext;
    }
}