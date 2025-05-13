import { DebuggerTester } from "../../../../debuggers/debugger-tester";
import { XhrContext } from "../../../../context/xhr-context";

/**
 * onabort事件回调
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort_event
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @param eventCallbackFunction {Function | null}
 * @returns {Function}
 */
export function addOnabortHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext, eventCallbackFunction: Function | null = null): Function {
    return xhrObject.onabort = () => {
        // 检查上下文是否符合条件断点
        DebuggerTester.test(xhrContext);

        // 跟进去下面这个函数就是处理响应体的代码逻辑了
        if (eventCallbackFunction) {
            return eventCallbackFunction.apply(xhrObject, arguments);
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
function collectInformation(xhrObject: XMLHttpRequest, xhrContext: XhrContext): void {
    // 暂时为空实现
} 