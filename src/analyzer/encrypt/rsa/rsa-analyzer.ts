import { XhrContext } from "../../../context/xhr-context";
import { RsaContext } from "./rsa-context";

/**
 * RSA加密分析器
 */
export class RsaAnalyzer {

    /**
     * 分析请求中的RSA加密
     * @param xhrContext {XhrContext} XHR上下文
     * @returns {RsaContext | null} RSA上下文，如果没有找到RSA加密则返回 null
     */
    analyze(_xhrContext: XhrContext): RsaContext | null {
        return null;
    }
} 