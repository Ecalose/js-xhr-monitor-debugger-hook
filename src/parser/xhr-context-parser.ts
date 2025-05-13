import { XhrContext } from "../context/xhr-context";
import { RequestContextParser } from "./request-context-parser";

/**
 * XHR上下文解析器
 */
export class XhrContextParser {
    /**
     * 使用URL更新XHR上下文
     * @param xhrContext {XhrContext} XHR上下文
     * @param url {string} URL字符串
     */
    updateWithUrl(xhrContext: XhrContext, url: string): void {
        new RequestContextParser().updateWithUrl(xhrContext.requestContext, url);
    }
} 