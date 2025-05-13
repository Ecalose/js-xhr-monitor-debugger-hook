import { XhrContext } from '../../../../context/xhr-context';
import { XhrContextParser } from '../../../../parser/xhr-context-parser';
import { formatToUrl } from '../../../../utils/url-util';
import { OpenMessage } from '../../../../message-formatter/request/method/open-message';
import { AuthContext } from '../../../../context/auth-context';

type OpenMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT' | 'PATCH';
type OpenFunction = (method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null) => void;

/**
 * 为open添加代理，以便在访问的时候能够拦截得到
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/open
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @returns {Proxy<Function>}
 */
export function addOpenHook(xhrObject: XMLHttpRequest, xhrContext: XhrContext): OpenFunction {
    return new Proxy(xhrObject.open, {
        apply(target: OpenFunction, thisArg: any, argArray: any[]): void {
            collectInformation(xhrObject, xhrContext, argArray);

            // TODO 2025-01-11 00:18:43 断点测试

            return target.apply(xhrObject, argArray);
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
function collectInformation(xhrObject: XMLHttpRequest, xhrContext: XhrContext, argArray: any[]): void {
    try {
        // 从第三个参数开始是可选的
        const [method, url, isAsync, username, password] = argArray;

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