import { UrlEncodeCodec } from "../../../codec/commons/url-encode-codec/url-encode-codec";
import { RequestContext } from "../../../context/request-context";
import { ResponseContext } from "../../../context/response-context";
import { Param } from "../../../context/param";

/**
 * URL编码分析器
 */
export class UrlEncodeAnalyzer {

    /**
     * 分析请求上下文中的URL编码
     * @param requestContext {RequestContext} 请求上下文
     */
    static analyzeRequestContext(requestContext: RequestContext): void {
        if (!requestContext.bodyContext) {
            return;
        }

        const rawBody = requestContext.bodyContext.getRawBodyPlain();
        if (!rawBody || !UrlEncodeCodec.isEncode(rawBody)) {
            return;
        }

        requestContext.bodyContext.isRawBodyUrlEncode = true;
        requestContext.bodyContext.rawBodyUrlDecode = UrlEncodeCodec.decode(rawBody);
    }

    /**
     * 分析响应上下文中的URL编码
     * @param responseContext {ResponseContext} 响应上下文
     */
    static analyzeResponseContext(responseContext: ResponseContext): void {
        if (!responseContext.bodyContext) {
            return;
        }

        const rawBody = responseContext.bodyContext.getRawBodyPlain();
        if (!rawBody || !UrlEncodeCodec.isEncode(rawBody)) {
            return;
        }

        responseContext.bodyContext.isRawBodyUrlEncode = true;
        responseContext.bodyContext.rawBodyUrlDecode = UrlEncodeCodec.decode(rawBody);
    }

    /**
     * 分析参数中的URL编码
     * @param param {Param} 参数
     */
    static analyzeParam(param: Param): void {
        if (!param.value || !UrlEncodeCodec.isEncode(param.value)) {
            return;
        }

        param.isUrlEncoded = true;
        param.urlDecodedValue = UrlEncodeCodec.decode(param.value);
    }
} 