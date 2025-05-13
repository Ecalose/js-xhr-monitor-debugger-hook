import { XhrContext } from "../../../../context/xhr-context";

/**
 * 拦截 overrideMimeType() 方法
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/overrideMimeType
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @returns {Proxy<Function>}
 */
export function addOverrideMimeTypeHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): (mimeType: string) => void {
    return new Proxy(xhrObject.overrideMimeType, {
        apply(target: (mimeType: string) => void, thisArg: any, argArray: any[]): void {
            try {
                // 记录MIME类型的覆盖
                xhrContext.requestContext.headerContext.add(
                    'Content-Type',
                    argArray[0]
                );
                
                // 调用原始的overrideMimeType方法
                return target.apply(xhrObject, argArray);
            } catch (error) {
                console.error('Error in overrideMimeTypeHook:', error);
                throw error;
            }
        }
    });
} 