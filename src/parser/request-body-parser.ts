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
 */
export class RequestBodyParser {

    /**
     * 解析请求体
     * @param body 请求体数据
     * @returns {BodyContext} 请求体上下文
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

            if (GzipCodec.isGzipCompressed(decodeData)) {
                decodeData = GzipCodec.decode(decodeData);
            }

            const file = {
                buffer: decodeData,
                position: 0,
                read: function (bytes: number): Uint8Array {
                    const chunk = this.buffer.slice(this.position, this.position + bytes);
                    this.position += bytes;
                    return chunk;
                },
            };

            const protoBufResult = new ProtoBufCodec().decode(file);
            if (protoBufResult) {
                const bodyContext = new BodyContext();
                bodyContext.rawBody = JSON.stringify(protoBufResult);
                return bodyContext;
            }

            const text = new TextDecoder('utf-8').decode(decodeData);
            return new TextBodyParser().parse(text);
        }

        return new BodyContext();
    }
} 