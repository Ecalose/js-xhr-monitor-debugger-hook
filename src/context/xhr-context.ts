import { RequestContext } from './request-context';
import { ResponseContext } from './response-context';

/**
 * XhrContext 类
 * 用于表示一个 XMLHttpRequest (XHR) 请求的上下文。
 * 该类封装了请求和响应的上下文信息，方便对 XHR 请求进行管理和操作。
 *
 * 参考文档：
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
 */
class XhrContext {
    // 请求上下文
    requestContext: RequestContext;

    // 响应上下文
    responseContext: ResponseContext;

    /**
     * 构造函数
     * 初始化 XhrContext 实例，创建请求上下文和响应上下文的实例。
     */
    constructor() {
        // 初始化请求上下文
        this.requestContext = new RequestContext();
        // 初始化响应上下文
        this.responseContext = new ResponseContext();
    }
}

export {
    XhrContext
};