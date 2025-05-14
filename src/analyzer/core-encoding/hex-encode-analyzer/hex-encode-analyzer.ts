import { RequestContext } from "../../../context/request-context";
import { ResponseContext } from "../../../context/response-context";
import { Param } from "../../../context/param";
import { HexCodec } from "../../../codec/commons/hex-codec/hex-codec";

/**
 * 十六进制编码分析器
 */
export class HexEncodeAnalyzer {

    /**
     * 分析请求上下文中的十六进制编码
     * @param requestContext {RequestContext} 请求上下文
     */
    static analyzeRequestContext(requestContext: RequestContext): void {
        // 请求参数
        for (const param of requestContext.getParams()) {
            this.analyzeParam(param);
        }

        // 请求体
        const rawBody = requestContext.bodyContext.getRawBodyPlain();
        if (!rawBody || !HexCodec.isHex(rawBody)) {
            return;
        }
        const decodedBody = HexCodec.decode(rawBody);
        if (decodedBody instanceof DataView) {
            requestContext.bodyContext.rawBodyHexDecode = new TextDecoder().decode(decodedBody);
        } else {
            requestContext.bodyContext.rawBodyHexDecode = decodedBody;
        }
        requestContext.bodyContext.isRawBodyHex = true;
    }

    /**
     * 分析响应上下文中的十六进制编码
     * @param responseContext {ResponseContext} 响应上下文
     */
    static analyzeResponseContext(responseContext: ResponseContext): void {
        // 响应体
        const rawBody = responseContext.bodyContext.getRawBodyPlain();
        if (!rawBody || !HexCodec.isHex(rawBody)) {
            return;
        }
        const decodedBody = HexCodec.decode(rawBody);
        if (decodedBody instanceof DataView) {
            responseContext.bodyContext.rawBodyHexDecode = new TextDecoder().decode(decodedBody);
        } else {
            responseContext.bodyContext.rawBodyHexDecode = decodedBody;
        }
        responseContext.bodyContext.isRawBodyHex = true;
    }

    /**
     * 分析param并设置相关字段
     * @param param {Param} 参数对象
     */
    static analyzeParam(param: Param): void {
        const value = param.getValuePlain();
        if (!value || !HexCodec.isHex(value)) {
            return;
        }
        const decodedValue = HexCodec.decode(value);
        if (decodedValue instanceof DataView) {
            param.valueHexDecode = new TextDecoder().decode(decodedValue);
        } else {
            param.valueHexDecode = decodedValue;
        }
        param.isValueHex = true;
    }
} 