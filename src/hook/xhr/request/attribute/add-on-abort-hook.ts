import { DebuggerTester } from "../../../../debuggers/debugger-tester";
import { XhrContext } from "../../../../context/xhr-context";

/**
 * onabort事件回调
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort_event
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @param eventCallbackFunction {((this: XMLHttpRequest, ev: ProgressEvent) => any) | null}
 * @returns {(this: XMLHttpRequest, ev: ProgressEvent) => any}
 */
export function addOnabortHook(
    xhrObject: XMLHttpRequest, 
    xhrContext: XhrContext, 
    eventCallbackFunction: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null = null
): (this: XMLHttpRequest, ev: ProgressEvent) => any {
    return function(this: XMLHttpRequest, ev: ProgressEvent): any {
        // 检查上下文是否符合条件断点
        DebuggerTester.test(xhrContext);

        // 跟进去下面这个函数就是处理响应体的代码逻辑了
        if (eventCallbackFunction) {
            return eventCallbackFunction.call(this, ev);
        } else {
            return null;
        }
    };
}

/**
 * 收集信息
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 */
function _collectInformation(_xhrObject: XMLHttpRequest, _xhrContext: XhrContext): void {
    // 暂时为空实现
}

/**
 * 添加 onabort 钩子
 * @param xhrObject {XMLHttpRequest} XHR对象
 * @param xhrContext {XhrContext} XHR上下文
 */
export function addOnAbortHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): void {
    const originalOnAbort = xhrObject.onabort;

    xhrObject.onabort = function(this: XMLHttpRequest, ev: ProgressEvent): void {
        // 调用原始的 onabort 处理函数
        if (typeof originalOnAbort === 'function') {
            originalOnAbort.call(this, ev);
        }
    };
} 