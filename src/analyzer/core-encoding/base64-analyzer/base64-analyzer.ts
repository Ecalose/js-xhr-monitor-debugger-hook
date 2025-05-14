import { RequestContext } from "../../../context/request-context";
import { ResponseContext } from "../../../context/response-context";
import { Param } from "../../../context/param";
import { Base64Codec } from "../../../codec/commons/base64-codec/base64-codec";

/**
 * Base64编码分析器
 */
export class Base64Analyzer {
    /**
     * 分析请求上下文中的Base64编码
     * @param requestContext {RequestContext} 请求上下文
     */
    static analyzeRequestContext(requestContext: RequestContext): void {
        if (!requestContext.bodyContext) {
            return;
        }

        const rawBody = requestContext.bodyContext.getRawBodyPlain();
        if (!rawBody || !Base64Codec.isBase64(rawBody)) {
            return;
        }

        requestContext.bodyContext.isRawBodyBase64 = true;
        requestContext.bodyContext.rawBodyBase64Decode = Base64Codec.decode(rawBody);
    }

    /**
     * 分析响应上下文中的Base64编码
     * @param responseContext {ResponseContext} 响应上下文
     */
    static analyzeResponseContext(responseContext: ResponseContext): void {
        if (!responseContext.bodyContext) {
            return;
        }

        const rawBody = responseContext.bodyContext.getRawBodyPlain();
        if (!rawBody || !Base64Codec.isBase64(rawBody)) {
            return;
        }

        responseContext.bodyContext.isRawBodyBase64 = true;
        responseContext.bodyContext.rawBodyBase64Decode = Base64Codec.decode(rawBody);
    }

    /**
     * 分析参数中的Base64编码
     * @param param {Param} 参数
     */
    static analyzeParam(param: Param): void {
        if (!param.value) {
            return;
        }

        const value = param.getValuePlain();
        if (!value || !Base64Codec.isBase64(value)) {
            return;
        }

        param.valueBase64Decode = Base64Codec.decode(value);
        param.isValueBase64 = true;
    }
} 