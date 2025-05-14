import { XhrContext } from "../../../../context/xhr-context";
import { ResponseContextParser } from "../../../../parser/response-context-parser";

/**
 * 添加 addEventListener 方法钩子
 * @param xhrObject {XMLHttpRequest} XHR对象
 * @param xhrContext {XhrContext} XHR上下文
 */
export function addAddEventListenerHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): void {
    const originalAddEventListener = xhrObject.addEventListener;

    xhrObject.addEventListener = new Proxy(originalAddEventListener, {
        apply(target: XMLHttpRequest['addEventListener'], thisArg: unknown, [eventName, eventFunction, options]: [string, EventListenerOrEventListenerObject, (boolean | AddEventListenerOptions)?]): void {
            // 如果是 readystatechange 事件，则需要特殊处理
            if (eventName === 'readystatechange') {
                const wrappedFunction = function(this: XMLHttpRequest, ev: Event): void {
                    if (this.readyState === XMLHttpRequest.DONE) {
                        // 解析响应上下文
                        xhrContext.responseContext = new ResponseContextParser().parse(xhrObject);
                    }

                    // 调用原始的事件处理函数
                    if (typeof eventFunction === 'function') {
                        eventFunction.call(this, ev);
                    } else if (typeof (eventFunction as EventListenerObject).handleEvent === 'function') {
                        (eventFunction as EventListenerObject).handleEvent.call(this, ev);
                    }
                };
                target.call(xhrObject, eventName, wrappedFunction, options);
            } else {
                target.call(xhrObject, eventName, eventFunction, options);
            }
        }
    });
} 