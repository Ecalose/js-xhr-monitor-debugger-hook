import { HeaderContext } from './header-context';
import { UrlContext } from './url-context';
import { BodyContext } from './body-context';
import { AuthContext } from './auth-context';
import { EventContext } from './event-context';
import { Header } from './header';
import { Param } from './param';

/**
 * 表示一个请求上下文
 */
class RequestContext {
    method: string | null;

    // 请求的当前状态
    // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/readyState
    readyState: number;

    isAsync: boolean;
    isAbortted: boolean;

    // 认证相关的上下文
    authContext: AuthContext;

    // 事件上下文
    eventContext: EventContext;

    urlContext: UrlContext;

    // 请求携带的请求体
    bodyContext: BodyContext;

    // 请求的请求头上下文
    headerContext: HeaderContext;

    constructor() {
        this.method = null;
        this.readyState = XMLHttpRequest.UNSENT;
        this.isAsync = true;
        this.isAbortted = false;
        this.authContext = new AuthContext();
        this.eventContext = new EventContext();
        this.urlContext = new UrlContext();
        this.bodyContext = new BodyContext();
        this.headerContext = new HeaderContext();
    }

    /**
     * 获取请求中所有的上下文
     * @return {Param[]} 所有参数的数组
     */
    getParams(): Param[] {
        const params: Param[] = [];
        params.push(...this.urlContext.params);
        params.push(...this.bodyContext.params);
        return params;
    }

    /**
     * 获取Content-Type请求头
     * @return {Header|null} Content-Type请求头对象，如果不存在则返回null
     */
    getContentTypeHeader(): Header | null {
        return this.headerContext.getByName("content-type");
    }

    /**
     * 判断请求体是否是json
     * @return {boolean} 如果是json则返回true，否则返回false
     */
    isJson(): boolean {
        const header = this.getContentTypeHeader();
        if (!header) {
            return false;
        }
        return header.value?.toLowerCase().includes("application/json") || false;
    }

    /**
     * 判断请求体是否是表单
     * @return {boolean} 如果是表单则返回true，否则返回false
     */
    isForm(): boolean {
        const header = this.getContentTypeHeader();
        if (!header) {
            return false;
        }
        const contentType = header.value?.toLowerCase();
        // TODO 2025-01-11 11:09:47 是否还有其它类型
        return contentType?.includes("application/x-www-form-urlencoded;") || false;
    }

    /**
     * 判断请求是否结束
     * @return {boolean} 如果请求结束则返回true，否则返回false
     */
    isRequestDone(): boolean {
        return this.readyState === XMLHttpRequest.DONE;
    }
}

export {
    RequestContext
}; 