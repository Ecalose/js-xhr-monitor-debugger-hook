import { BodyContext } from "../context/body-context";
import { ContentType } from "../context/content-type";
import { ContextLocation } from "../context/context-location";

/**
 * 响应体解析器
 * 
 * 用于解析XMLHttpRequest的响应体数据，根据不同的响应类型采用不同的处理策略。
 * 该解析器能处理多种响应类型，包括文本、JSON、Blob、ArrayBuffer和XML文档等。
 * 解析结果会被封装在BodyContext对象中，便于统一处理和分析。
 * 
 * @example
 * // 使用示例
 * const parser = new ResponseBodyParser();
 * const xhr = new XMLHttpRequest();
 * // ... 发送请求并接收响应 ...
 * const bodyContext = parser.parse(xhr);
 * console.log(bodyContext.contentType); // 输出响应的内容类型
 * console.log(bodyContext.rawBody); // 输出原始响应体
 */
export class ResponseBodyParser {

    /**
     * 解析响应体
     * 
     * 根据XMLHttpRequest对象的responseType属性，解析响应体数据并创建相应的BodyContext对象。
     * 不同的响应类型会使用不同的处理方式：
     * - text: 直接使用responseText
     * - json: 将response对象转为JSON字符串
     * - blob: 使用Blob对象
     * - arraybuffer: 使用ArrayBuffer对象
     * - document: 将XML文档序列化为字符串
     * 
     * @param xhrObject {XMLHttpRequest} XHR对象 - 包含响应数据的XMLHttpRequest对象
     * @returns {BodyContext} 响应体上下文 - 包含解析后的响应体数据和元数据
     * 
     * @example
     * // 文本响应示例
     * const xhr = new XMLHttpRequest();
     * xhr.open('GET', 'https://api.example.com/data', false);
     * xhr.send();
     * const bodyContext = parse(xhr);
     * // 如果响应是文本类型
     * // bodyContext.contentType = ContentType.PLAINTEXT
     * // bodyContext.rawBody = "响应文本内容"
     * // bodyContext.location = ContextLocation.RESPONSE
     * 
     * @example
     * // JSON响应示例
     * const xhr = new XMLHttpRequest();
     * xhr.responseType = 'json';
     * xhr.open('GET', 'https://api.example.com/data.json', false);
     * xhr.send();
     * const bodyContext = parse(xhr);
     * // bodyContext.contentType = ContentType.JSON
     * // bodyContext.rawBody = '{"id":123,"name":"示例"}'
     * 
     * @example
     * // 二进制响应示例
     * const xhr = new XMLHttpRequest();
     * xhr.responseType = 'arraybuffer';
     * xhr.open('GET', 'https://api.example.com/image.png', false);
     * xhr.send();
     * const bodyContext = parse(xhr);
     * // bodyContext.contentType = ContentType.ARRAYBUFFER
     * // bodyContext.rawBody = [ArrayBuffer对象]
     */
    parse(xhrObject: XMLHttpRequest): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.location = ContextLocation.RESPONSE;

        // 根据响应类型设置内容
        switch (xhrObject.responseType) {
            case 'text':
            case '':
                bodyContext.contentType = ContentType.PLAINTEXT;
                bodyContext.rawBody = xhrObject.responseText;
                break;

            case 'json':
                bodyContext.contentType = ContentType.JSON;
                bodyContext.rawBody = JSON.stringify(xhrObject.response);
                break;

            case 'blob':
                bodyContext.contentType = ContentType.BLOB;
                bodyContext.rawBody = xhrObject.response;
                break;

            case 'arraybuffer':
                bodyContext.contentType = ContentType.ARRAYBUFFER;
                bodyContext.rawBody = xhrObject.response;
                break;

            case 'document':
                bodyContext.contentType = ContentType.XML;
                if (xhrObject.responseXML) {
                    bodyContext.xmlContent = xhrObject.responseXML;
                    bodyContext.rawBody = new XMLSerializer().serializeToString(xhrObject.responseXML);
                }
                break;

            default:
                bodyContext.contentType = ContentType.UNKNOWN;
                if (typeof xhrObject.response === 'string' || 
                    xhrObject.response instanceof Blob || 
                    xhrObject.response instanceof ArrayBuffer || 
                    xhrObject.response instanceof FormData || 
                    xhrObject.response instanceof URLSearchParams) {
                    bodyContext.rawBody = xhrObject.response;
                } else {
                    bodyContext.rawBody = null;
                }
                break;
        }

        return bodyContext;
    }
} 