import { ProtoBufCodec } from '../../../../codec/commons/protobuf-codec/protobuf-codec';
import { GzipCodec } from '../../../../codec/commons/gzip-codec/gzip-codec';
import { FormParamParser } from '../../../../parser/form-param-parser';
import { FormBodyParser } from '../../../../parser/form-body-parser';
import { JsonBodyParser } from '../../../../parser/json-body-parser';
import { ContextLocation } from '../../../../context/context-location';
import { SignAnalyzer } from '../../../../analyzer/encrypt/sign/sign-analyzer';
import { Base64Analyzer } from '../../../../analyzer/core-encoding/base64-analyzer/base64-analyzer';
import { UrlEncodeAnalyzer } from '../../../../analyzer/core-encoding/url-encode-analyzer/url-encode-analyzer';
import { HexEncodeAnalyzer } from '../../../../analyzer/core-encoding/hex-encode-analyzer/hex-encode-analyzer';
import { TextBodyParser } from '../../../../parser/text-body-parser';
import { SendMessage } from '../../../../message-formatter/request/method/send-message';
import { XhrContext } from '../../../../context/xhr-context';
import { BlobBodyParser } from '../../../../parser/blob-body-parser';
import { ArrayBufferBodyParser } from '../../../../parser/array-buffer-body-parser';
import { FormDataBodyParser } from '../../../../parser/form-data-body-parser';
import { UrlSearchParamsBodyParser } from '../../../../parser/url-search-params-body-parser';
import { DebuggerTester } from '../../../../debuggers/debugger-tester';

type SendData = Document | XMLHttpRequestBodyInit | null | undefined;

/**
 * 为send方法生成代理对象并返回
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @returns {(data?: SendData) => void}
 */
export function addSendHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): (data?: SendData) => void {
    return new Proxy(xhrObject.send, {
        apply(target: (data?: SendData) => void, thisArg: any, argArray: any[]): void {
            // send只会有有一个参数
            const [data] = argArray;

            try {
                // 在发送请求前测试断点
                DebuggerTester.test(xhrContext);
            } catch (e) {
                console.error('Error testing debugger:', e);
            }

            // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
            // post设置body的情况要能够拦截得到
            try {
                if (data) {
                    // data可能会是以下几种类型：
                    // Blob | BufferSource | FormData | URLSearchParams | string
                    if (typeof data === "string") {
                        // request body 是 string 类型，大多数情况下也是这种类型
                        if (xhrContext.requestContext.isJson()) {
                            const bodyContext = xhrContext.requestContext.bodyContext = new JsonBodyParser().parse(data);
                            bodyContext.location = ContextLocation.REQUEST;
                        } else if (xhrContext.requestContext.isForm()) {
                            // 测试网站：
                            // - https://passport.fang.com/
                            xhrContext.requestContext.bodyContext = new FormBodyParser().parse(data);
                            // 测试断点
                            DebuggerTester.test(xhrContext);
                        } else {
                            // 纯文本的请求
                            xhrContext.requestContext.bodyContext = new TextBodyParser().parse(data);
                        }
                    } else if (data instanceof Blob) {
                        // Blob 类型
                        xhrContext.requestContext.bodyContext = new BlobBodyParser().parse(data);
                    } else if (data instanceof ArrayBuffer) {
                        // ArrayBuffer 类型
                        xhrContext.requestContext.bodyContext = new ArrayBufferBodyParser().parse(data);
                    } else if (data instanceof FormData) {
                        // FormData 类型
                        xhrContext.requestContext.bodyContext = new FormDataBodyParser().parse(data);
                    } else if (data instanceof URLSearchParams) {
                        // URLSearchParams 类型
                        xhrContext.requestContext.bodyContext = new UrlSearchParamsBodyParser().parse(data);
                    } else if (data instanceof Uint8Array) {
                        let decodeData = data;

                        const gzipCodec = new GzipCodec();
                        if (gzipCodec.isGzipCompressed(decodeData)) {
                            decodeData = gzipCodec.decode(decodeData);
                        }

                        // 尝试解析为ProtoBuf
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
                            xhrContext.requestContext.bodyContext = protoBufResult;
                        } else {
                            // 如果不是ProtoBuf，尝试解析为UTF-8文本
                            const text = new TextDecoder('utf-8').decode(decodeData);
                            xhrContext.requestContext.bodyContext = new TextBodyParser().parse(text);
                        }
                    }
                }
            } catch (e) {
                console.error('Error processing request body:', e);
            }

            // 分析请求中的各种编码
            UrlEncodeAnalyzer.analyzeRequestContext(xhrContext.requestContext);
            Base64Analyzer.analyzeRequestContext(xhrContext.requestContext);
            HexEncodeAnalyzer.analyzeRequestContext(xhrContext.requestContext);

            // 测试网站：
            // https://liuyan.people.com.cn/home/
            // https://music.91q.com/album/P10004267254
            const signContext = new SignAnalyzer().analyze(xhrContext);
            if (signContext) {
                console.log("检测到sign: " + signContext.name + ":" + signContext.value + ", url = " + xhrContext.requestContext.urlContext.rawUrl);
            }

            // 在控制台上打印上下文
            SendMessage.print(xhrContext);

            return target.apply(xhrObject, argArray);
        }
    });
} 