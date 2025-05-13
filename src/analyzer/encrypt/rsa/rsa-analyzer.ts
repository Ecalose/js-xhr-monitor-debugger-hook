import {XhrContext} from "../../../context/xhr-context";
import {JsonAnalyzer} from "../../json-analyzer";
import {ResponseContext} from "../../../context/response-context";
import {RsaContext} from "./rsa-context";
import {RequestContext} from "../../../context/request-context";

/**
 * RSA分析器
 */
class RsaAnalyzer {

    /**
     * 分析XHR上下文中的RSA加密信息
     * @param xhrContext {XhrContext} XHR上下文
     * @return {RsaContext | null} 如果找到RSA加密信息则返回RSA上下文，否则返回null
     */
    analyze(xhrContext: XhrContext): RsaContext | null {
        return this.analyzeResponse(xhrContext.responseContext);
    }

    /**
     * 分析请求上下文中的RSA加密信息
     * @param requestContext {RequestContext} 请求上下文
     * @returns {RsaContext | null} 如果找到RSA加密信息则返回RSA上下文，否则返回null
     */
    analyzeRequest(requestContext: RequestContext): RsaContext | null {
        return null;
    }

    /**
     * 分析响应上下文中的RSA加密信息
     * @param responseContext {ResponseContext} 响应上下文
     * @returns {RsaContext | null} 如果找到RSA加密信息则返回RSA上下文，否则返回null
     */
    analyzeResponse(responseContext: ResponseContext): RsaContext | null {
        const rsaContext = new RsaContext();

        if (responseContext.isJson()) {
            // 在JSON中寻找
            new JsonAnalyzer().deepTraverse(responseContext.bodyContext.object, function (name: string | undefined, path: string, value: any) {
                if (name === "modulus") {
                    rsaContext.modulus = value;
                    rsaContext.modulusJsonPath = path;
                } else if (name === "exponent") {
                    rsaContext.exponent = value;
                    rsaContext.exponentJsonPath = path;
                }
            });
        }
        if (rsaContext.modulus && rsaContext.exponent) {
            return rsaContext;
        } else {
            return null;
        }
    }

}

export {
    RsaAnalyzer
}; 