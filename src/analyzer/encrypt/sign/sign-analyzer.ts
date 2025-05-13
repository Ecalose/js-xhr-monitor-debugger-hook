import { XhrContext } from "../../../context/xhr-context";
import { SignContext } from "./sign-context";
import { RequestContext } from "../../../context/request-context";
import { ResponseContext } from "../../../context/response-context";
import { Param } from "../../../context/param";

/**
 * 签名分析器
 */
class SignAnalyzer {

    /**
     * 分析XHR上下文中的签名
     * @param xhrContext {XhrContext} XHR上下文
     * @returns {SignContext | null} 如果找到签名参数则返回签名上下文，否则返回null
     */
    analyze(xhrContext: XhrContext): SignContext | null {
        const signParam = this.analyzeRequest(xhrContext.requestContext);
        if (signParam && signParam.name && signParam.value) {
            return new SignContext(signParam.name, signParam.value);
        } else {
            return null;
        }
    }

    /**
     * 分析请求上下文中的签名参数
     * @param requestContext {RequestContext} 请求上下文
     * @returns {Param | null} 如果找到签名参数则返回该参数，否则返回null
     */
    analyzeRequest(requestContext: RequestContext): Param | null {
        for(let param of requestContext.getParams()) {
            if (this.maybeSignName(param.name)) {
                return param;
            }
        }
        return null;
    }

    /**
     * 判断参数名是否可能是签名参数
     * @param name {string} 参数名
     * @returns {boolean} 如果参数名可能是签名参数则返回true，否则返回false
     */
    maybeSignName(name: string): boolean {
        name = name.toLowerCase();
        const signNameSet = new Set<string>();
        signNameSet.add("sign");
        signNameSet.add("_sign");
        signNameSet.add("signature");
        return signNameSet.has(name);
    }

    /**
     * 分析响应上下文中的签名
     * @param responseContext {ResponseContext} 响应上下文
     */
    analyzeResponse(responseContext: ResponseContext): void {

    }

}

export {
    SignAnalyzer
}; 