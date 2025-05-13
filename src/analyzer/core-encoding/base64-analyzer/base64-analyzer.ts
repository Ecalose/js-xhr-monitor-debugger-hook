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
     * @param requestContext 请求上下文
     */
    static analyzeRequestContext(requestContext: RequestContext): void {
        // 请求参数
        for (let param of requestContext.getParams()) {
            this.analyzeParam(param);
        }

        // 请求体
        if (!Base64Codec.isBase64(requestContext.bodyContext.getRawBodyPlain())) {
            return;
        }
        requestContext.bodyContext.rawBodyBase64Decode = Base64Codec.decode(requestContext.bodyContext.getRawBodyPlain());
        requestContext.bodyContext.isRawBodyBase64 = true;
    }

    /**
     * 分析响应上下文中的Base64编码
     * @param responseContext 响应上下文
     */
    static analyzeResponseContext(responseContext: ResponseContext): void {
        // 响应体
        if (!Base64Codec.isBase64(responseContext.bodyContext.getRawBodyPlain())) {
            return;
        }
        responseContext.bodyContext.rawBodyBase64Decode = Base64Codec.decode(responseContext.bodyContext.getRawBodyPlain());
        responseContext.bodyContext.isRawBodyBase64 = true;
    }

    /**
     * 分析param并设置相关字段
     * @param param 参数对象
     */
    static analyzeParam(param: Param): void {
        if (!Base64Codec.isBase64(param.getValuePlain())) {
            return;
        }
        param.valueBase64Decode = Base64Codec.decode(param.getValuePlain());
        param.isValueBase64 = true;
    }
} 