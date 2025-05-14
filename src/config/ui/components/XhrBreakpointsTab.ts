/**
 * XHR断点标签页组件
 */
import { DebuggerConfig } from '../../../debuggers/debugger';

/**
 * XHR断点类型定义
 */
export interface XhrBreakpoint {
    id: number;
    url: string;
    enabled: boolean;
    condition?: string;
    showDetails?: boolean;
    debuggerConfig: DebuggerConfig;
}

/**
 * XHR断点标签页模板
 */
export const xhrBreakpointsTemplate = `
<div class="jsrei-tab-pane">
    <h3>XHR请求断点</h3>
    <p>设置匹配URL的XHR请求断点，支持正则表达式</p>
    
    <div class="jsrei-breakpoints-list">
        <div v-if="xhrBreakpoints.length === 0" class="jsrei-empty-list">
            暂无断点，点击下方按钮添加
        </div>
        
        <div v-for="bp in xhrBreakpoints" :key="bp.id" class="jsrei-breakpoint-item">
            <!-- 基本控制 -->
            <div class="jsrei-breakpoint-controls">
                <div class="jsrei-breakpoint-header">
                    <input type="checkbox" v-model="bp.enabled" />
                    <input type="text" v-model="bp.url" placeholder="URL匹配规则" class="jsrei-url-input" />
                    <button class="jsrei-expand-btn" @click="bp.showDetails = !bp.showDetails">
                        {{ bp.showDetails ? '收起' : '展开' }}
                    </button>
                    <button class="jsrei-remove-btn" @click="removeBreakpoint(bp.id)">删除</button>
                </div>
                
                <!-- 简单条件 -->
                <div class="jsrei-breakpoint-condition">
                    <input type="text" v-model="bp.condition" placeholder="条件表达式 (可选，例如: method === 'POST')" class="jsrei-condition-input" />
                </div>
            </div>
            
            <!-- 详细配置 -->
            <div v-if="bp.showDetails" class="jsrei-breakpoint-details">
                <h4>请求阶段</h4>
                <div class="jsrei-breakpoint-options">
                    <label>
                        <input type="checkbox" v-model="bp.debuggerConfig.enableDebuggerBeforeRequestSend" />
                        请求发送前
                    </label>
                    <label>
                        <input type="checkbox" v-model="bp.debuggerConfig.enableDebuggerAfterResponseReceive" />
                        响应接收后
                    </label>
                </div>
                
                <h4>匹配条件</h4>
                <div class="jsrei-breakpoint-options">
                    <div class="jsrei-breakpoint-option">
                        <label>请求URL匹配:</label>
                        <input type="checkbox" v-model="bp.debuggerConfig.enableRequestUrlFilter" />
                        <input 
                            type="text" 
                            v-model="bp.debuggerConfig.requestUrlCondition" 
                            placeholder="URL匹配条件" 
                            :disabled="!bp.debuggerConfig.enableRequestUrlFilter" 
                        />
                    </div>
                    
                    <div class="jsrei-breakpoint-option">
                        <label>请求头名称匹配:</label>
                        <input type="text" v-model="bp.debuggerConfig.setRequestHeaderNameCondition" placeholder="头部名称" />
                    </div>
                    
                    <div class="jsrei-breakpoint-option">
                        <label>请求头值匹配:</label>
                        <input type="text" v-model="bp.debuggerConfig.setRequestHeaderValueCondition" placeholder="头部值" />
                    </div>
                    
                    <div class="jsrei-breakpoint-option">
                        <label>请求体匹配:</label>
                        <input type="text" v-model="bp.debuggerConfig.requestBodyCondition" placeholder="请求体内容" />
                    </div>
                    
                    <div class="jsrei-breakpoint-option">
                        <label>响应头名称匹配:</label>
                        <input type="text" v-model="bp.debuggerConfig.getResponseHeaderNameCondition" placeholder="头部名称" />
                    </div>
                    
                    <div class="jsrei-breakpoint-option">
                        <label>响应头值匹配:</label>
                        <input type="text" v-model="bp.debuggerConfig.getResponseHeaderValueCondition" placeholder="头部值" />
                    </div>
                    
                    <div class="jsrei-breakpoint-option">
                        <label>响应体匹配:</label>
                        <input type="text" v-model="bp.debuggerConfig.responseBodyCondition" placeholder="响应体内容" />
                    </div>
                </div>
                
                <h4>断点动作</h4>
                <div class="jsrei-breakpoint-options">
                    <label>
                        <input type="checkbox" v-model="bp.debuggerConfig.actionDebuggerEnable.open" />
                        XHR.open
                    </label>
                    <label>
                        <input type="checkbox" v-model="bp.debuggerConfig.actionDebuggerEnable.setRequestHeader" />
                        XHR.setRequestHeader
                    </label>
                    <label>
                        <input type="checkbox" v-model="bp.debuggerConfig.actionDebuggerEnable.send" />
                        XHR.send
                    </label>
                    <label>
                        <input type="checkbox" v-model="bp.debuggerConfig.actionDebuggerEnable.responseCallback" />
                        响应回调
                    </label>
                    <label>
                        <input type="checkbox" v-model="bp.debuggerConfig.actionDebuggerEnable.visitResponseAttribute" />
                        访问响应属性
                    </label>
                </div>
            </div>
        </div>
    </div>
    
    <div class="jsrei-actions">
        <button class="jsrei-action-btn" @click="addBreakpoint">添加断点</button>
    </div>
</div>
`;

/**
 * 创建默认的调试器配置
 */
function createDefaultDebuggerConfig(): DebuggerConfig {
    return {
        enable: true,
        enableRequestUrlFilter: true,
        requestUrlCondition: null,
        requestParamNameCondition: null,
        requestParamValueCondition: null,
        setRequestHeaderNameCondition: null,
        setRequestHeaderValueCondition: null,
        requestBodyCondition: null,
        getResponseHeaderNameCondition: null,
        getResponseHeaderValueCondition: null,
        responseBodyCondition: null,
        enableDebuggerBeforeRequestSend: true,
        enableDebuggerAfterResponseReceive: true,
        actionDebuggerEnable: {
            open: true,
            setRequestHeader: false,
            send: true,
            responseCallback: true,
            visitResponseAttribute: false
        }
    };
}

/**
 * XHR断点标签页方法
 */
export const xhrBreakpointsMethods = {
    /**
     * 添加新的XHR断点
     */
    addBreakpoint(this: { xhrBreakpoints: XhrBreakpoint[] }): void {
        const newId = this.xhrBreakpoints.length > 0 
            ? Math.max(...this.xhrBreakpoints.map(bp => bp.id)) + 1 
            : 1;
        this.xhrBreakpoints.push({
            id: newId,
            url: '',
            enabled: true,
            showDetails: false,
            debuggerConfig: createDefaultDebuggerConfig()
        });
    },

    /**
     * 移除指定ID的XHR断点
     * @param id 断点ID
     */
    removeBreakpoint(this: { xhrBreakpoints: XhrBreakpoint[] }, id: number): void {
        const index = this.xhrBreakpoints.findIndex(bp => bp.id === id);
        if (index !== -1) {
            this.xhrBreakpoints.splice(index, 1);
        }
    }
};

/**
 * 默认XHR断点数据
 */
export const defaultXhrBreakpoints: XhrBreakpoint[] = [
    { 
        id: 1, 
        url: 'api/users', 
        enabled: true,
        showDetails: false,
        debuggerConfig: createDefaultDebuggerConfig()
    },
    { 
        id: 2, 
        url: 'api/products', 
        enabled: false, 
        condition: 'method === "POST"',
        showDetails: false,
        debuggerConfig: createDefaultDebuggerConfig()
    }
]; 