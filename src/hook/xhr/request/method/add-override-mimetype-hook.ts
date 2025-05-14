import { XhrContext } from "../../../../context/xhr-context";

/**
 * 添加 overrideMimeType 方法钩子
 * @param xhrObject {XMLHttpRequest} XHR对象
 * @param xhrContext {XhrContext} XHR上下文
 */
export function addOverrideMimeTypeHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): void {
    const originalOverrideMimeType = xhrObject.overrideMimeType;

    xhrObject.overrideMimeType = new Proxy(originalOverrideMimeType, {
        apply(target: (mimeType: string) => void, thisArg: unknown, [mimeType]: [string]): void {
            xhrContext.requestContext.overrideMimeType = mimeType;
            target.call(xhrObject, mimeType);
        }
    });
} 