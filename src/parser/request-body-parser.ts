import { BodyContext } from "../context/body-context";
import { TextBodyParser } from "./text-body-parser";
import { BlobBodyParser } from "./blob-body-parser";
import { ArrayBufferBodyParser } from "./array-buffer-body-parser";
import { FormDataBodyParser } from "./form-data-body-parser";
import { UrlSearchParamsBodyParser } from "./url-search-params-body-parser";
import { GzipCodec } from "../codec/commons/gzip-codec/gzip-codec";
import { ProtoBufCodec } from "../codec/commons/protobuf-codec/protobuf-codec";

/**
 * 请求体解析器
 * 
 * 这是一个通用的请求体解析器，能够处理多种不同类型的请求体数据。
 * 根据输入数据的类型，自动选择合适的子解析器进行处理，包括：
 * - 字符串：使用TextBodyParser
 * - Blob：使用BlobBodyParser
 * - ArrayBuffer：使用ArrayBufferBodyParser
 * - FormData：使用FormDataBodyParser
 * - URLSearchParams：使用UrlSearchParamsBodyParser
 * - Uint8Array：尝试进行Gzip解压和ProtoBuf解码
 * 
 * 该解析器是XHR监控系统中处理请求体数据的核心组件。
 * 
 * @example
 * // 使用示例
 * const parser = new RequestBodyParser();
 * const jsonData = JSON.stringify({name: 'test', id: 123});
 * const bodyContext = parser.parse(jsonData);
 * console.log(bodyContext.rawBody); // 输出原始请求体内容
 */
export class RequestBodyParser {

    /**
     * 解析请求体
     * 
     * 根据输入数据的类型，使用不同的子解析器来处理请求体数据。
     * 支持多种数据类型：string, Blob, ArrayBuffer, FormData, URLSearchParams, Uint8Array等。
     * 对于Uint8Array类型，会尝试进行Gzip解压缩和ProtoBuf解码。
     * 如果输入为null或undefined，则返回空的BodyContext对象。
     * 
     * @param body {Document | XMLHttpRequestBodyInit | null} 请求体数据 - 要解析的请求体，可以是多种类型
     * @returns {BodyContext} 请求体上下文 - 包含解析后的请求体数据和元数据
     * 
     * @example
     * // 解析JSON字符串示例
     * const jsonBody = '{"id": 123, "name": "产品名称"}';
     * const bodyContext = parse(jsonBody);
     * // bodyContext.rawBody = '{"id": 123, "name": "产品名称"}'
     * // 类型会被TextBodyParser设置为PLAINTEXT或JSON(根据内容判断)
     * 
     * @example
     * // 解析表单数据示例
     * const formData = new FormData();
     * formData.append('username', 'admin');
     * formData.append('file', new File(['文件内容'], 'test.txt'));
     * const bodyContext = parse(formData);
     * // bodyContext会包含FormData的解析结果
     * 
     * @example
     * // 解析URL参数示例
     * const params = new URLSearchParams('id=123&action=create');
     * const bodyContext = parse(params);
     * // bodyContext会包含URL参数的解析结果
     * 
     * @example
     * // 解析二进制数据示例
     * const binaryData = new Uint8Array([...]);
     * const bodyContext = parse(binaryData);
     * // 如果是Gzip压缩的数据，会先解压
     * // 如果是ProtoBuf格式，会尝试解码
     * // 否则会转换为文本并解析
     */
    parse(body: Document | XMLHttpRequestBodyInit | null): BodyContext {
        if (!body) {
            return new BodyContext();
        }

        if (typeof body === "string") {
            return new TextBodyParser().parse(body);
        }

        if (body instanceof Blob) {
            return new BlobBodyParser().parse(body);
        }

        if (body instanceof ArrayBuffer) {
            return new ArrayBufferBodyParser().parse(body);
        }

        if (body instanceof FormData) {
            return new FormDataBodyParser().parse(body);
        }

        if (body instanceof URLSearchParams) {
            return new UrlSearchParamsBodyParser().parse(body);
        }

        if (body instanceof Uint8Array) {
            let decodeData = body;

            // 尝试进行Gzip解压缩
            if (GzipCodec.isGzipCompressed(decodeData)) {
                decodeData = GzipCodec.decode(decodeData);
            }

            // 创建用于ProtoBuf解码的文件对象
            const file = {
                buffer: decodeData,
                position: 0,
                read: function (bytes: number): Uint8Array {
                    const chunk = this.buffer.slice(this.position, this.position + bytes);
                    this.position += bytes;
                    return chunk;
                },
            };

            // 尝试ProtoBuf解码
            const protoBufResult = new ProtoBufCodec().decode(file);
            if (protoBufResult) {
                const bodyContext = new BodyContext();
                bodyContext.rawBody = JSON.stringify(protoBufResult);
                return bodyContext;
            }

            // 若无法以ProtoBuf解码，则尝试转为UTF-8文本
            const text = new TextDecoder('utf-8').decode(decodeData);
            return new TextBodyParser().parse(text);
        }

        // 若无法识别类型，返回空的上下文对象
        return new BodyContext();
    }
} 