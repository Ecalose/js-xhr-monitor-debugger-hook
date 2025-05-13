import { addOnreadystatechangeHook } from "../../response/attribute/add-onreadystatechange-hook";
import { ResponseContextParser } from "../../../../parser/response-context-parser";
import { UrlEncodeAnalyzer } from "../../../../analyzer/core-encoding/url-encode-analyzer/url-encode-analyzer";
import { HexEncodeAnalyzer } from "../../../../analyzer/core-encoding/hex-encode-analyzer/hex-encode-analyzer";
import { Base64Analyzer } from "../../../../analyzer/core-encoding/base64-analyzer/base64-analyzer";
import { RsaAnalyzer } from "../../../../analyzer/encrypt/rsa/rsa-analyzer";
import { XhrContext } from "../../../../context/xhr-context";

/**
 * 为XHR添加事件响应函数时将被拦截到
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @return {Proxy<Function>}
 */
export function addAddEventListenerHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): Function {
    return new Proxy(xhrObject.addEventListener, {
        apply(target: Function, thisArg: any, argArray: any[]): void {
            // 记录事件状态
            const [eventName, eventFunction] = argArray;
            try {
                const event = new Event(eventName, eventFunction);
                xhrContext.requestContext.eventContext.addEvent(event);
            } catch (e) {
                console.error(e);
            }

            // 根据不同的事件名称有不同的处理逻辑
            try {
                switch (eventName) {
                    case "readystatechange":
                        // 设置的是请求回调方法
                        addReadystatechangeEventHook(target, xhrObject, xhrContext, argArray);
                        break;
                    default:
                        // 默认情况下就直接添加事件回调
                        return target.apply(xhrObject, argArray);
                }
            } catch (e) {
                console.error(e);
            }
        }
    });
}

/**
 * 处理readystatechange事件的钩子
 * @param proxyTarget {Function}
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @param argArray {any[]}
 */
function addReadystatechangeEventHook(proxyTarget: Function, xhrObject: XMLHttpRequest, xhrContext: XhrContext, argArray: any[]): void {
    const [eventName, eventFunction] = argArray;
    argArray[1] = function () {
        try {
            xhrContext.requestContext.readyState = xhrObject.readyState;
            if (xhrContext.requestContext.isRequestDone()) {
                debugger;

                const responseContext = xhrContext.responseContext = new ResponseContextParser().parse(xhrObject, xhrContext);

                // 分析响应中的各种编码
                UrlEncodeAnalyzer.analyzeResponseContext(xhrContext.responseContext);
                HexEncodeAnalyzer.analyzeResponseContext(xhrContext.responseContext);
                Base64Analyzer.analyzeResponseContext(xhrContext.responseContext);

                // 响应体是整个编码的：
                // https://jzsc.mohurd.gov.cn/data/company

                const rsaContext = new RsaAnalyzer().analyze(xhrContext);
                if (rsaContext) {
                    debugger;
                }
            }
        } catch (e) {
            console.error(e);
        }

        eventFunction.apply(xhrObject, arguments);
    };
    proxyTarget.apply(xhrObject, argArray);
} 