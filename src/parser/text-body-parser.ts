import { BodyContext } from "../context/body-context";
import { ContextLocation } from "../context/context-location";
import { ContentType } from "../context/content-type";

/**
 * 文本请求体解析器
 * 
 * 用于解析纯文本格式的请求体数据，将其转换为标准的BodyContext对象。
 * 该解析器主要用于处理Content-Type为text/plain或没有指定Content-Type的请求体。
 * 解析后的结果会将contentType设置为PLAINTEXT，并不会尝试进一步解析文本内容。
 * 
 * @example
 * // 使用示例
 * const parser = new TextBodyParser();
 * const bodyContext = parser.parse("Hello World");
 * console.log(bodyContext.contentType); // 输出: PLAINTEXT
 * console.log(bodyContext.rawBody);     // 输出: "Hello World"
 */
export class TextBodyParser {
    /**
     * 解析文本请求体
     * 
     * 将输入的文本字符串解析为BodyContext对象，设置适当的位置、内容类型和原始内容。
     * 该方法不会对文本内容进行任何转换或特殊处理，仅创建一个包含原始文本的上下文对象。
     * 
     * @param text {string} 文本内容 - 需要解析的原始文本字符串
     * @return {BodyContext} 请求体上下文 - 包含解析后的文本内容信息
     * 
     * @example
     * // 基本使用
     * const bodyContext = parser.parse("用户名=张三&密码=123456");
     * 
     * @example
     * // 解析空文本
     * const emptyContext = parser.parse("");
     * console.log(emptyContext.rawBody); // 输出: ""
     * 
     * @example
     * // 解析包含特殊字符的文本
     * const specialContext = parser.parse("<script>alert('XSS')</script>");
     * // 文本会被原样保存，不会进行任何转义或处理
     */
    parse(text: string): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.location = ContextLocation.REQUEST;
        bodyContext.rawBody = text;
        bodyContext.contentType = ContentType.PLAINTEXT;
        bodyContext.params = [];
        return bodyContext;
    }
} 