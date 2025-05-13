import {UrlEncodeCodec} from "../../../codec/commons/url-encode-codec/url-encode-codec";
import {HexCodec} from "../../../codec/commons/hex-codec/hex-codec";
import {Base64Codec} from "../../../codec/commons/base64-codec/base64-codec";
import {RequestContext} from "../../../context/request-context";
import {ResponseContext} from "../../../context/response-context";
import {Param} from "../../../context/param";

/**
 * 十六进制编码分析器
 */
class HexEncodeAnalyzer {

    /**
     * 分析请求上下文中的十六进制编码
     * @param requestContext {RequestContext} 请求上下文
     */
    static analyzeRequestContext(requestContext: RequestContext): void {
        // 请求参数
        for (let param of requestContext.getParams()) {
            this.analyzeParam(param);
        }

        // 请求体
        if (!HexCodec.isHex(requestContext.bodyContext.getRawBodyPlain())) {
            return;
        }
        requestContext.bodyContext.rawBodyHexDecode = HexCodec.decode(requestContext.bodyContext.getRawBodyPlain());
        requestContext.bodyContext.isRawBodyHex = true;
    }

    /**
     * 分析响应上下文中的十六进制编码
     * @param responseContext {ResponseContext} 响应上下文
     */
    static analyzeResponseContext(responseContext: ResponseContext): void {
        // 响应体
        if (!HexCodec.isHex(responseContext.bodyContext.getRawBodyPlain())) {
            return;
        }
        responseContext.bodyContext.rawBodyHexDecode = HexCodec.decode(responseContext.bodyContext.getRawBodyPlain());
        responseContext.bodyContext.isRawBodyHex = true;
    }

    /**
     * 分析param并设置相关字段
     *
     * @param param {Param} 参数对象
     */
    static analyzeParam(param: Param): void {
        if (!HexCodec.isHex(param.getValuePlain())) {
            return;
        }
        param.isValueHex = HexCodec.decode(param.getValuePlain());
        param.valueHexDecode = true;
    }

}

export {
    HexEncodeAnalyzer
}; 