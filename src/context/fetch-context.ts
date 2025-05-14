import { RequestContext } from './request-context';
import { ResponseContext } from './response-context';

/**
 * FetchContext 类
 * 用于表示一个 Fetch API 请求的上下文。
 * 该类封装了请求和响应的上下文信息，方便对 Fetch 请求进行管理和操作。
 *
 * 参考文档：
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API
 */
class FetchContext {
    // 唯一请求标识
    id: string;
    
    // 请求上下文
    requestContext: RequestContext;

    // 响应上下文
    responseContext: ResponseContext;

    // 原始请求
    originalRequest: Request | null = null;

    // 原始响应
    originalResponse: Response | null = null;

    /**
     * 构造函数
     * 初始化 FetchContext 实例，创建请求上下文和响应上下文的实例。
     */
    constructor() {
        // 初始id为空字符串，会在FetchHook中被设置
        this.id = '';
        
        // 初始化请求上下文
        this.requestContext = new RequestContext();
        // 初始化响应上下文
        this.responseContext = new ResponseContext();
    }
}

export {
    FetchContext
}; 