import { BodyContext } from '../context/body-context';
import { ContentType } from '../context/content-type';
import { ContextLocation } from '../context/context-location';

/**
 * ArrayBuffer数据解析器
 * 
 * 用于解析二进制ArrayBuffer类型的请求体数据，将其转换为标准的BodyContext对象。
 * 该解析器主要用于处理原始二进制数据，比如WebSocket传输、文件读取等场景。
 * 解析后的结果会保存原始的ArrayBuffer对象，以便后续访问或进一步处理。
 * 
 * @example
 * // 使用示例
 * const parser = new ArrayBufferBodyParser();
 * const buffer = new ArrayBuffer(8);
 * const bodyContext = parser.parse(buffer);
 * console.log(bodyContext.arrayBufferData.byteLength); // 输出: 8
 */
export class ArrayBufferBodyParser {
    /**
     * 解析ArrayBuffer数据
     * 
     * 将输入的ArrayBuffer对象解析为BodyContext对象，保存原始的二进制数据。
     * 该方法会设置适当的位置、内容类型，并原样保存ArrayBuffer数据。
     * 
     * @param data {ArrayBuffer} ArrayBuffer对象 - 需要解析的二进制缓冲区数据
     * @returns {BodyContext} 解析后的上下文 - 包含ArrayBuffer数据的请求体上下文
     * 
     * @example
     * // 基本使用
     * const buffer = new ArrayBuffer(16);
     * const bodyContext = parser.parse(buffer);
     * 
     * @example
     * // 与TypedArray一起使用
     * const buffer = new ArrayBuffer(4);
     * const view = new Uint8Array(buffer);
     * view.set([1, 2, 3, 4]);
     * const bodyContext = parser.parse(buffer);
     * 
     * @example
     * // 从Blob转换并解析
     * const blob = new Blob(['binary data']);
     * blob.arrayBuffer().then(buffer => {
     *   const bodyContext = parser.parse(buffer);
     *   // 可以处理bodyContext...
     * });
     * 
     * @example
     * // 从网络请求获取并解析二进制数据
     * fetch('https://example.com/binary-data')
     *   .then(response => response.arrayBuffer())
     *   .then(buffer => {
     *     const bodyContext = parser.parse(buffer);
     *     // 处理获取到的二进制数据
     *   });
     */
    parse(data: ArrayBuffer): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = data;
        bodyContext.arrayBufferData = data;
        bodyContext.contentType = ContentType.BINARY;
        bodyContext.location = ContextLocation.REQUEST;
        return bodyContext;
    }
} 