import { ancestorXMLHttpRequestHolder } from './holder';
import { XMLHttpRequestObjectHook } from './xml-http-request-object-hook';
import { getUnsafeWindow } from '../../utils/unsafe-window';

interface UnsafeWindow extends Window {
    XMLHttpRequest: typeof XMLHttpRequest;
}

/**
 * Hook原型的方法
 */
export class XMLHttpRequestPrototypeHook {

    addHook(): void {
        let xMLHttpRequestHolder = ancestorXMLHttpRequestHolder;
        let cachedProxyXHR: typeof XMLHttpRequest | null = null;
        
        Object.defineProperty(getUnsafeWindow() as UnsafeWindow, 'XMLHttpRequest', {
            get: () => {
                if (!cachedProxyXHR) {
                    cachedProxyXHR = new Proxy(xMLHttpRequestHolder, {
                        // new XMLHttpRequest()的时候给替换掉返回的对象
                        construct(_target: typeof XMLHttpRequest, _argArray: unknown[]): XMLHttpRequest {
                            const xhrObject = new xMLHttpRequestHolder();
                            return new XMLHttpRequestObjectHook(xhrObject).addHook();
                        }
                    });
                }
                return cachedProxyXHR;
            },
            set: (newValue: typeof XMLHttpRequest) => {
                // 缓存失效
                cachedProxyXHR = null;
                // 设置为新的值，可能会存在多层嵌套的情况
                xMLHttpRequestHolder = newValue;
            },
            configurable: true
        });
    }
} 