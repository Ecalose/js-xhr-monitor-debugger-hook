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

// 默认的超时时间（毫秒）
const DEFAULT_TIMEOUT = 30000;

/**
 * 为XHR对象添加Hook
 */
export class XMLHttpRequestObjectHook {

    private xhrObject: XMLHttpRequest;
    private xhrContext: XhrContext;
    private originalTimeout: number;

    /**
     *
     * @param xhrObject {XMLHttpRequest}
     */
    constructor(xhrObject: XMLHttpRequest) {
        this.xhrObject = xhrObject;
        this.xhrContext = new XhrContext();
        this.originalTimeout = xhrObject.timeout;
    }

    private addOnreadystatechangeHook(value: EventListener): boolean {
        addOnreadystatechangeHook(this.xhrObject, this.xhrContext, value);
        return true;
    }

    /**
     *
     * @return {XMLHttpRequest}
     */
    addHook(): XMLHttpRequest {
        return new Proxy(this.xhrObject, {
            get: (target: XMLHttpRequest, p: string | symbol, receiver: unknown): unknown => {
                switch (p) {
                    case "open":
                        return addOpenHook(this.xhrObject, this.xhrContext);
                    case "send":
                        return addSendHook(this.xhrObject, this.xhrContext);
                    case "setRequestHeader":
                        return addSetRequestHeaderHook(this.xhrObject, this.xhrContext);
                    case "abort":
                        return addAbortHook(this.xhrObject, this.xhrContext);
                    case "overrideMimeType":
                        return addOverrideMimeTypeHook(this.xhrObject, this.xhrContext);

                    // 请求相关的属性
                    case "readyState":
                    case "timeout":
                    case "upload":
                    case "withCredentials":
                        return target[p as keyof XMLHttpRequest];

                    // 响应相关的方法
                    case "getAllResponseHeaders":
                    case "getResponseHeader":
                        return addVisitResponseHeaderHook(target, this.xhrContext, p);
                    // 响应相关的属性
                    case "response":
                    case "responseText":
                    case "responseType":
                    case "responseURL":
                    case "responseXML":
                        return addVisitResponsePropertyHook(target, this.xhrContext, p);
                    case "status":
                    case "statusText":
                        return target[p as keyof XMLHttpRequest];
                    case "addEventListener":
                        return addAddEventListenerHook(this.xhrObject, this.xhrContext);
                    default:
                        return target[p as keyof XMLHttpRequest];
                }
            },
            set: (target: XMLHttpRequest, p: string | symbol, value: unknown): boolean => {
                switch (p) {
                    case "onabort":
                        addOnabortHook(this.xhrObject, this.xhrContext);
                        return true;
                    case "onerror":
                    case "onload":
                    case "onloadend":
                    case "onloadstart":
                    case "onprogress":
                    case "ontimeout":
                        if (p in target && typeof p === 'string') {
                            ((target as unknown) as Record<string, EventListener>)[p] = value as EventListener;
                        }
                        return true;
                    case "timeout":
                        this.originalTimeout = value as number;
                        target.timeout = DEFAULT_TIMEOUT;
                        return true;
                    case "onreadystatechange":
                        return this.addOnreadystatechangeHook(value as EventListener);
                    default:
                        if (p in target && typeof p === 'string') {
                            ((target as unknown) as Record<string, unknown>)[p] = value;
                        }
                        return true;
                }
            }
        });
    }
} 