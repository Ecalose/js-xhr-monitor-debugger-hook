import { FormParamParser } from "./form-param-parser";
import { BodyContext } from "../context/body-context";
import { ContextLocation } from "../context/context-location";
import { ContentType } from "../context/content-type";

/**
 * 表单请求体解析器
 * 
 * 用于解析application/x-www-form-urlencoded格式的表单数据。
 * 表单数据通常是由键值对组成，以&符号分隔，如"key1=value1&key2=value2"格式。
 * 该解析器将表单字符串转换为结构化的BodyContext对象，并提取其中的参数。
 * 
 * @example
 * // 使用示例
 * const parser = new FormBodyParser();
 * const formString = 'username=admin&password=123456';
 * const bodyContext = parser.parse(formString);
 * console.log(bodyContext.params); // 输出解析后的参数列表
 */
export class FormBodyParser {
    /**
     * 解析表单字符串
     * 
     * 将URL编码的表单字符串解析为BodyContext对象，提取其中的参数信息。
     * 内部使用FormParamParser来解析表单参数，并将结果存储在BodyContext的params属性中。
     * 
     * @param formString {string} 表单字符串 - URL编码的表单数据，如"name=value&key=123"
     * @return {BodyContext} 请求体上下文 - 包含解析后的表单数据和元信息
     * 
     * @example
     * // 基本表单解析示例
     * const formString = 'username=john&age=25&active=true';
     * const bodyContext = parse(formString);
     * 
     * // 输出结果示例
     * // bodyContext.rawBody = 'username=john&age=25&active=true'
     * // bodyContext.contentType = ContentType.FORM
     * // bodyContext.location = ContextLocation.REQUEST
     * // bodyContext.params = [
     * //   {name: "username", value: "john"},
     * //   {name: "age", value: "25"},
     * //   {name: "active", value: "true"}
     * // ]
     * 
     * @example
     * // 特殊字符编码示例
     * const formString = 'search=hello%20world&filter=age%3E20';
     * const bodyContext = parse(formString);
     * // bodyContext.params中的参数会被URL解码
     * // [{name: "search", value: "hello world"}, {name: "filter", value: "age>20"}]
     */
    parse(formString: string): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.location = ContextLocation.REQUEST;
        bodyContext.rawBody = formString;
        bodyContext.contentType = ContentType.FORM;
        bodyContext.params = new FormParamParser().parse(formString);
        return bodyContext;
    }
}