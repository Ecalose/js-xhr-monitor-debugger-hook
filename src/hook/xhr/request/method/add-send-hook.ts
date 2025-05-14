import { XhrContext } from '../../../../context/xhr-context';
import { RequestBodyParser } from "../../../../parser/request-body-parser";

/**
 * 为send方法生成代理对象并返回
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @returns {void}
 */
export function addSendHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): void {
    const originalSend = xhrObject.send;

    xhrObject.send = new Proxy(originalSend, {
        apply(target: (body?: Document | XMLHttpRequestBodyInit | null) => void, thisArg: unknown, [body]: [Document | XMLHttpRequestBodyInit | null | undefined]): void {
            if (body) {
                const requestBodyParser = new RequestBodyParser();
                xhrContext.requestContext.bodyContext = requestBodyParser.parse(body);
            }
            target.call(xhrObject, body);
        }
    });
} 