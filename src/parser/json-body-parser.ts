import { BodyContext } from "../context/body-context";
import { ContentType } from "../context/content-type";
import { ContextLocation } from "../context/context-location";
import Logger from "../logger";

/**
 * JSON请求体解析器
 * 
 * 用于解析JSON格式的请求体或响应体数据，将其转换为结构化的BodyContext对象。
 * 该解析器负责从原始JSON字符串中提取数据，并设置合适的内容类型和上下文位置。
 * 如果解析过程中出现错误，将捕获异常并记录错误，保证解析过程不会中断。
 * 
 * @example
 * // 使用示例
 * const parser = new JsonBodyParser();
 * const jsonData = '{"username": "test", "age": 25}';
 * const bodyContext = parser.parse(jsonData);
 * console.log(bodyContext.jsonData); // 输出: {username: "test", age: 25}
 */
export class JsonBodyParser {
    /**
     * 解析JSON字符串
     * 
     * 将JSON格式的字符串解析为JavaScript对象，并封装在BodyContext对象中。
     * 设置合适的内容类型(ContentType.JSON)和上下文位置(默认为REQUEST)。
     * 
     * @param jsonString {string} JSON字符串 - 要解析的JSON格式字符串，如'{"name":"value"}'
     * @return {BodyContext} 请求体上下文 - 包含解析后的JSON数据和相关元数据的上下文对象
     * 
     * @example
     * // JSON解析示例
     * const jsonString = '{"id": 123, "items": ["apple", "orange"]}';
     * const result = parse(jsonString);
     * 
     * // 结果示例
     * // result.rawBody = '{"id": 123, "items": ["apple", "orange"]}'
     * // result.contentType = ContentType.JSON
     * // result.location = ContextLocation.REQUEST
     * // result.jsonData = {id: 123, items: ["apple", "orange"]}
     * 
     * @throws {Error} 如果JSON字符串格式不正确，内部会捕获异常并记录错误，返回jsonData为null的BodyContext
     */
    parse(jsonString: string): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = jsonString;
        bodyContext.contentType = ContentType.JSON;
        bodyContext.location = ContextLocation.REQUEST;
        try {
            bodyContext.jsonData = JSON.parse(jsonString);
        } catch (error) {
            Logger.error('Error parsing JSON:', error);
            bodyContext.jsonData = null;
        }
        return bodyContext;
    }
} 