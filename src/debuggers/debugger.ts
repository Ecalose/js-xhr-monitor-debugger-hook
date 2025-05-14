/**
 * 调试器配置接口
 */
export interface DebuggerConfig {
    enable?: boolean;
    enableRequestUrlFilter?: boolean;
    requestUrlCondition?: string | null;
    requestParamNameCondition?: string | null;
    requestParamValueCondition?: string | null;
    setRequestHeaderNameCondition?: string | null;
    setRequestHeaderValueCondition?: string | null;
    requestBodyCondition?: string | null;
    getResponseHeaderNameCondition?: string | null;
    getResponseHeaderValueCondition?: string | null;
    responseBodyCondition?: string | null;
    enableDebuggerBeforeRequestSend?: boolean;
    enableDebuggerAfterResponseReceive?: boolean;
    actionDebuggerEnable?: {
        open?: boolean;
        setRequestHeader?: boolean;
        send?: boolean;
        responseCallback?: boolean;
        visitResponseAttribute?: boolean;
    };
}

/**
 * 调试器基类
 */
export class Debugger {
    /**
     * 匹配器类型
     */
    matcherType: string;

    /**
     * 调试器配置
     */
    config: DebuggerConfig;

    constructor(config?: DebuggerConfig) {
        this.matcherType = "";
        this.config = config || {};
    }
} 