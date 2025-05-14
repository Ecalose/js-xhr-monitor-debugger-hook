import { XhrContext } from "../../../../context/xhr-context";

/**
 * 添加 abort 方法钩子
 * @param xhrObject {XMLHttpRequest} XHR对象
 * @param _xhrContext {XhrContext} XHR上下文
 */
export function addAbortHook(xhrObject: XMLHttpRequest, _xhrContext: XhrContext): void {
    const originalAbort = xhrObject.abort;

    xhrObject.abort = new Proxy(originalAbort, {
        apply(target: () => void, _thisArg: unknown, _args: []): void {
            target.call(xhrObject);
        }
    });
}