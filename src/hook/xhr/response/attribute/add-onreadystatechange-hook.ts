import { ResponseContextParser } from "../../../../parser/response-context-parser";
import { XhrContext } from "../../../../context/xhr-context";
import { RsaAnalyzer } from "../../../../analyzer/encrypt/rsa/rsa-analyzer";
import { UrlEncodeAnalyzer } from "../../../../analyzer/core-encoding/url-encode-analyzer/url-encode-analyzer";
import { Base64Analyzer } from "../../../../analyzer/core-encoding/base64-analyzer/base64-analyzer";
import { HexEncodeAnalyzer } from "../../../../analyzer/core-encoding/hex-encode-analyzer/hex-encode-analyzer";

/**
 * 在设置 onreadystatechange 的时候替换为自己的函数
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readystatechange_event
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @param callbackFunction {Function | null}
 * @returns {Function}
 */
export function addOnreadystatechangeHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext, callbackFunction: Function | null): Function {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readystatechange_event
    return xhrObject.onreadystatechange = () => {
        try {
            xhrContext.requestContext.readyState = xhrObject.readyState;
            if (xhrContext.requestContext.isRequestDone()) {
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

        // 跟进去下面这个函数就是处理响应体的代码逻辑了
        if (callbackFunction) {
            return callbackFunction.apply(xhrObject, arguments);
        } else {
            return null;
        }
    };
} 