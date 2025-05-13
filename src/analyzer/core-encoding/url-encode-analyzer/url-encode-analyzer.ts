import { UrlEncodeCodec } from "../../../codec/commons/url-encode-codec/url-encode-codec";
import { HexCodec } from "../../../codec/commons/hex-codec/hex-codec";
import { RequestContext } from "../../../context/request-context";
import { ResponseContext } from "../../../context/response-context";
import { Param } from "../../../context/param";

/**
 * URL编码分析器
 */
class UrlEncodeAnalyzer {
    /**
     * 分析请求上下文中的URL编码
     * @param requestContext {RequestContext} - 请求上下文
     */
    static analyzeRequestContext(requestContext: RequestContext): void {
        // 请求参数
        for (let param of requestContext.getParams()) {
            this.analyzeParam(param);
        }

        // 请求体
        if (!UrlEncodeCodec.isEncode(requestContext.bodyContext.getRawBodyPlain())) {
            return;
        }
        requestContext.bodyContext.rawBodyHexDecode = UrlEncodeCodec.decode(requestContext.bodyContext.getRawBodyPlain());
        requestContext.bodyContext.isRawBodyHex = true;
    }

    /**
     * 分析响应上下文中的URL编码
     * @param responseContext {ResponseContext} - 响应上下文
     */
    static analyzeResponseContext(responseContext: ResponseContext): void {
        // 响应体
        if (!UrlEncodeCodec.isEncode(responseContext.bodyContext.getRawBodyPlain())) {
            return;
        }
        responseContext.bodyContext.rawBodyHexDecode = UrlEncodeCodec.decode(responseContext.bodyContext.getRawBodyPlain());
        responseContext.bodyContext.isRawBodyHex = true;
    }

    /**
     * 分析param并设置相关字段
     * @param param {Param} - 参数对象
     */
    static analyzeParam(param: Param): void {
        if (!UrlEncodeCodec.isEncode(param.value)) {
            return;
        }
        param.valueUrlDecode = UrlEncodeCodec.decode(param.value);
        param.isValueUrlEncode = true;
    }
}

export {
    UrlEncodeAnalyzer
}; 