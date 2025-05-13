import { XhrContext } from '../../context/xhr-context';
import { addSendHook } from './request/method/add-send-hook';
import { addVisitResponseHeaderHook } from './response/attribute/add-visit-response-header-hook';
import { addOpenHook } from './request/method/add-open-hook';
import { addSetRequestHeaderHook } from './request/method/add-set-request-header-hook';
import { addAbortHook } from './request/method/add-abort-hook';
import { addOverrideMimeTypeHook } from './request/method/add-override-mimetype-hook';
import { addOnreadystatechangeHook } from './response/attribute/add-onreadystatechange-hook';
import { addAddEventListenerHook } from './request/method/add-add-event-listener-hook';
import { addVisitResponsePropertyHook } from './response/attribute/add-visit-response-property-hook';
import { addOnabortHook } from './request/attribute/add-on-abort-hook';

/**
 * 为XHR对象添加Hook
 */
export class XMLHttpRequestObjectHook {

    private xhrObject: XMLHttpRequest;
    private xhrContext: XhrContext;

    /**
     *
     * @param xhrObject {XMLHttpRequest}
     */
    constructor(xhrObject: XMLHttpRequest) {
        this.xhrObject = xhrObject;
        this.xhrContext = new XhrContext();
    }

    /**
     *
     * @return {XMLHttpRequest}
     */
    addHook(): XMLHttpRequest {
        const _this = this;
        return new Proxy(this.xhrObject, {
            get(target: XMLHttpRequest, p: string | symbol): any {
                switch (p) {

                    // 请求相关的方法

                    case "open":
                        return addOpenHook(_this.xhrObject, _this.xhrContext);
                    case "send":
                        return addSendHook(_this.xhrObject, _this.xhrContext);
                    case "setRequestHeader":
                        return addSetRequestHeaderHook(_this.xhrObject, _this.xhrContext);
                    case "abort":
                        return addAbortHook(_this.xhrObject, _this.xhrContext);
                    case "overrideMimeType":
                        return addOverrideMimeTypeHook(_this.xhrObject, _this.xhrContext);

                    // 请求相关的属性

                    // 这几个属性就忽略不再拦截了
                    case "readyState":
                    case "timeout":
                    case "upload":
                    case "withCredentials":
                        return target[p as keyof XMLHttpRequest];

                    // 响应相关的方法
                    case "getAllResponseHeaders":
                    case "getResponseHeader":
                        return addVisitResponseHeaderHook(_this.xhrObject, _this.xhrContext, p);
                    // 响应相关的属性
                    case "response":
                    case "responseText":
                    case "responseType":
                    case "responseURL":
                    case "responseXML":
                        return addVisitResponsePropertyHook(_this.xhrObject, _this.xhrContext, p);
                    case "status":
                    case "statusText":
                        return target[p as keyof XMLHttpRequest];
                    // 事件处理，搞一个专门的单元来处理，添加事件可以通过addEventListener
                    // 也可以直接on+事件名称，所以要把两种情况都覆盖住
                    case "addEventListener":
                        return addAddEventListenerHook(_this.xhrObject, _this.xhrContext);

                    default:
                        // 其它情况就不拦截了，直接放行
                        return target[p as keyof XMLHttpRequest];
                }
            },
            set(target: XMLHttpRequest, p: string | symbol, value: any): boolean {
                switch (p) {
                    case "onabort":
                        addOnabortHook(_this.xhrObject, _this.xhrContext);
                        (target as any)[p] = value;
                        return true;
                    case "onerror":
                    case "onload":
                    case "onloadend":
                    case "onloadstart":
                    case "onprogress":
                    case "ontimeout":
                        // TODO 2025-01-11 15:21:44 锁定超时时间，这样在断点长时间分析的时候不至于一直失败
                        (target as any)[p] = value;
                        return true;
                    case "onreadystatechange":
                        addOnreadystatechangeHook(_this.xhrObject, _this.xhrContext, value);
                        (target as any)[p] = value;
                        return true;
                    // case "withCredentials":
                    //     // 设置携带凭证的时候拦截一下
                    //     return _this.addWithCredentialsHook();
                    default:
                        // 默认情况下就直接赋值，不再尝试Hook
                        (target as any)[p] = value;
                        return true;
                }
            }
        });
    }
} 