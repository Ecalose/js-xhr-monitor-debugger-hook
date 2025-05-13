import { XhrContext } from "../../../../context/xhr-context";

/**
 * 拦截 abort() 方法
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/abort
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @returns {Proxy<Function>}
 */
export function addAbortHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): () => void {
    return new Proxy(xhrObject.abort, {
        apply(target: () => void, thisArg: any, argArray: any[]): void {
            // 设置请求状态
            xhrContext.requestContext.isAbortted = true;
            
            // TODO 2025-01-11 00:11:30 断点测试

            return target.apply(xhrObject, argArray);
        }
    });
} 