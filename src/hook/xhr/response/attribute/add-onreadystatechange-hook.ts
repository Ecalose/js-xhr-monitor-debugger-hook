import { ResponseContextParser } from "../../../../parser/response-context-parser";
import { XhrContext } from "../../../../context/xhr-context";
import { RsaAnalyzer } from "../../../../analyzer/encrypt/rsa/rsa-analyzer";
import { UrlEncodeAnalyzer } from "../../../../analyzer/core-encoding/url-encode-analyzer/url-encode-analyzer";
import { Base64Analyzer } from "../../../../analyzer/core-encoding/base64-analyzer/base64-analyzer";
import { HexEncodeAnalyzer } from "../../../../analyzer/core-encoding/hex-encode-analyzer/hex-encode-analyzer";
import { DebuggerTester } from "../../../../debuggers/debugger-tester";

type ReadyStateChangeHandler = ((this: XMLHttpRequest, ev: Event) => unknown) | null;

/**
 * 在设置 onreadystatechange 的时候替换为自己的函数
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readystatechange_event
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @param callbackFunction {ReadyStateChangeHandler}
 * @returns {ReadyStateChangeHandler}
 */
export function addOnreadystatechangeHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext, callbackFunction: ReadyStateChangeHandler): ReadyStateChangeHandler {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readystatechange_event
    return function(this: XMLHttpRequest, ev: Event): unknown {
        try {
            xhrContext.requestContext.readyState = xhrObject.readyState;
            if (xhrContext.requestContext.isRequestDone()) {
                xhrContext.responseContext = new ResponseContextParser().parse(xhrObject);

                // 分析响应中的各种编码
                UrlEncodeAnalyzer.analyzeResponseContext(xhrContext.responseContext);
                HexEncodeAnalyzer.analyzeResponseContext(xhrContext.responseContext);
                Base64Analyzer.analyzeResponseContext(xhrContext.responseContext);

                // 响应体是整个编码的：
                // https://jzsc.mohurd.gov.cn/data/company

                const rsaContext = new RsaAnalyzer().analyze(xhrContext);
                if (rsaContext) {
                    // 测试断点
                    DebuggerTester.test(xhrContext);
                }
            }
        } catch (e) {
            console.error(e);
        }

        // 跟进去下面这个函数就是处理响应体的代码逻辑了
        if (callbackFunction) {
            return callbackFunction.call(this, ev);
        }
        return undefined;
    };
} 