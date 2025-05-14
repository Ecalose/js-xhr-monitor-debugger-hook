import { XhrContext } from '../../../../context/xhr-context';
import { XhrContextParser } from '../../../../parser/xhr-context-parser';
import { formatToUrl } from '../../../../utils/url-util';
import { OpenMessage } from '../../../../message-formatter/request/method/open-message';
import { AuthContext } from '../../../../context/auth-context';

type OpenMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT' | 'PATCH';
type OpenFunction = (method: string, url: string, async?: boolean, username?: string | null, password?: string | null) => void;

/**
 * 为open添加代理，以便在访问的时候能够拦截得到
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @returns {void}
 */
export function addOpenHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): void {
    const originalOpen = xhrObject.open;

    xhrObject.open = new Proxy(originalOpen, {
        apply(target: OpenFunction, thisArg: unknown, [method, url, isAsync = true, username, password]: [string, string, boolean?, string?, string?]): void {
            collectInformation(xhrObject, xhrContext, [method, url, isAsync, username, password]);
            target.call(xhrObject, method, url, isAsync, username, password);
        }
    });
}

/**
 * 收集请求上的信息
 *
 * @param xhrObject
 * @param xhrContext
 * @param argArray
 */
function collectInformation(xhrObject: XMLHttpRequest, xhrContext: XhrContext, [method, url, isAsync = true, username, password]: [string, string, boolean?, string?, string?]): void {
    try {
        const formattedUrl = formatToUrl(url);
        new XhrContextParser().updateWithUrl(xhrContext, formattedUrl);
        const requestContext = xhrContext.requestContext;
        requestContext.isAsync = isAsync;
        requestContext.method = method.toUpperCase() as OpenMethod;
        // console.log("open " + url);

        if (username || password) {
            requestContext.authContext = new AuthContext(username, password);
        }

        OpenMessage.print(xhrContext);
    } catch (e) {
        console.error(e);
    }
} 