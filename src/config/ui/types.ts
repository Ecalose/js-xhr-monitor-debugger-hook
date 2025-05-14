/**
 * UI组件类型定义
 */

// Vue相关类型
export interface VueAppOptions {
    data?: () => any;
    methods?: Record<string, Function>;
    template?: string;
    components?: Record<string, any>;
    setup?: (props: any) => any;
}

export interface Vue {
    createApp: (options: VueAppOptions) => {
        mount: (selector: string) => void;
        _instance?: { data: any };
    };
}

// 应用状态类型
export interface AppState {
    showModal: boolean;
    activeTab: string;
    tabs: TabItem[];
    xhrBreakpoints: XhrBreakpoint[];
    settings: Settings;
}

// 标签页定义
export interface TabItem {
    id: string;
    name: string;
}

// XHR断点定义
export interface XhrBreakpoint {
    id: number;
    url: string;
    enabled: boolean;
    condition?: string;
}

// 设置项定义
export interface Settings {
    darkMode: boolean;
    autoCapture: boolean;
    maxHistorySize: number;
    notifyOnCapture: boolean;
}

// 油猴API类型声明
declare global {
    function GM_registerMenuCommand(
        name: string,
        callback: () => void,
        accessKey?: string
    ): number;

    function GM_xmlhttpRequest(details: {
        method: string;
        url: string;
        onload: (response: { responseText: string }) => void;
        onerror: (error: Error) => void;
    }): void;

    const Vue: Vue;
} 