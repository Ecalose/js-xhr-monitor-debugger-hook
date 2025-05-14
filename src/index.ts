import { init } from './init/init';
import { Debugger, DebuggerConfig } from './debuggers/debugger';
import { initLogger } from './logger';
import Logger from './logger/logger';

// 初始化日志系统
initLogger();

// 默认的配置
const defaultConfig: DebuggerConfig = {
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
export const defaultDebugger = new Debugger(defaultConfig);

// 导出所有需要的类和函数
export { Debugger, DebuggerConfig } from './debuggers/debugger';
export { XhrContext } from './context/xhr-context';
export { FetchContext } from './context/fetch-context';
export { XMLHttpRequestPrototypeHook } from './hook/xhr/xml-http-request-prototype-hook';
export { XMLHttpRequestObjectHook } from './hook/xhr/xml-http-request-object-hook';
export { FetchHook, addFetchHook } from './hook/fetch';
export { IDGenerator } from './debuggers/id-generator';
export { Logger } from './logger';

// 初始化
(async () => {
    try {
        Logger.info('正在初始化 JS-XHR-HOOK...');
        init();
        Logger.info('JS-XHR-HOOK 初始化完成');
    } catch (error) {
        Logger.error('JS-XHR-HOOK 初始化失败:', error);
    }
})(); 