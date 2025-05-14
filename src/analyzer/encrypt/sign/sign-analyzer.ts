import { XhrContext } from "../../../context/xhr-context";
import { SignContext } from "./sign-context";

/**
 * 签名分析器
 */
export class SignAnalyzer {

    /**
     * 分析请求中的签名
     * @param xhrContext {XhrContext} XHR上下文
     * @returns {SignContext | null} 签名上下文，如果没有找到签名则返回 null
     */
    analyze(xhrContext: XhrContext): SignContext | null {
        // 分析请求参数中的签名
        for (const param of xhrContext.requestContext.getParams()) {
            if (param.name && this.maybeSignName(param.name)) {
                const signContext = new SignContext();
                signContext.name = param.name;
                signContext.value = param.value || '';
                return signContext;
            }
        }

        // 分析请求头中的签名
        for (const header of xhrContext.requestContext.headerContext.getAll()) {
            if (header.name && this.maybeSignName(header.name)) {
                const signContext = new SignContext();
                signContext.name = header.name;
                signContext.value = header.value || '';
                return signContext;
            }
        }

        return null;
    }

    /**
     * 判断是否可能是签名名称
     * @param name {string} 名称
     * @returns {boolean} 是否可能是签名名称
     */
    private maybeSignName(name: string): boolean {
        const lowerName = name.toLowerCase();
        return lowerName.includes('sign') || 
               lowerName.includes('signature') || 
               lowerName.includes('token') || 
               lowerName.includes('auth');
    }
} 