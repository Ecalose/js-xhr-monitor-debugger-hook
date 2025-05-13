import { init } from './init/init';
import { XhrDebugger } from './core/xhr-debugger';

// 默认的配置
const defaultConfig = {
    // 是否启用调试器
    enable: true,

    // 是否启用请求 URL 过滤
    enableRequestUrlFilter: true,

    // 请求 URL 条件
    requestUrlCondition: null,

    // 请求参数名条件
    requestParamNameCondition: null,

    // 请求参数值条件
    requestParamValueCondition: null,

    // 请求头名称条件
    setRequestHeaderNameCondition: null,

    // 请求头值条件
    setRequestHeaderValueCondition: null,

    // 请求体条件
    requestBodyCondition: null,

    // 响应头名称条件
    getResponseHeaderNameCondition: null,

    // 响应头值条件
    getResponseHeaderValueCondition: null,

    // 响应体条件
    responseBodyCondition: null,

    // 是否在请求发送前进入断点
    enableDebuggerBeforeRequestSend: true,

    // 是否在请求发送后进入断点
    enableDebuggerAfterResponseReceive: true,

    // 各种操作的断点配置
    actionDebuggerEnable: {
        open: true,
        setRequestHeader: true,
        send: true,
        responseCallback: true,
        visitResponseAttribute: false
    }
};

// 创建默认的调试器实例
export const defaultDebugger = new XhrDebugger(defaultConfig);

// 导出所有需要的类和函数
export { XhrDebugger } from './core/xhr-debugger';
export { XMLHttpRequestContext } from './context/xhr-context';
export { XMLHttpRequestPrototypeHook } from './hook/xhr/xml-http-request-prototype-hook';
export { XMLHttpRequestObjectHook } from './hook/xhr/xml-http-request-object-hook';
export { IDGenerator } from './core/id-generator';

// 初始化
(async () => {
    init();
})(); 