/**
 * Vue加载模块
 */
import { getUnsafeWindow } from '../../utils/unsafe-window';
import Logger from '../../logger/logger';

/**
 * Vue实例类型定义
 */
export interface Vue {
    createApp: (options: any) => {
        mount: (selector: string) => void;
        _instance?: { data: any };
    };
}

// 为Window类型扩展，添加我们的自定义属性
interface ExtendedWindow extends Window {
    __JSREI_Vue?: Vue;
}

// 用于存储隔离的Vue实例
let isolatedVue: Vue | null = null;

/**
 * 使用油猴API加载Vue，并隔离于页面的其他Vue实例
 * @param callback 加载成功后的回调函数
 */
export function loadVue(callback: (vue: Vue) => void): void {
    // 如果已经加载过，直接返回缓存的Vue实例
    if (isolatedVue) {
        Logger.debug('使用缓存的Vue实例');
        callback(isolatedVue);
        return;
    }

    Logger.info('开始从CDN加载Vue.js');
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://unpkg.com/vue@3/dist/vue.global.js',
        onload: function (response) {
            try {
                Logger.debug('Vue.js下载成功，开始初始化隔离环境');
                // 获取真实的页面窗口对象
                const realWindow = getUnsafeWindow() as ExtendedWindow;
                
                // 使用IIFE隔离Vue实例，避免全局污染
                const scriptContent = `
                (function() {
                    ${response.responseText}
                    // 将Vue实例存储在自定义变量中而不是全局window对象上
                    window.__JSREI_Vue = Vue;
                    // 防止Vue暴露到全局作用域
                    Vue = undefined;
                })();
                `;
                
                // 创建并执行脚本
                const script = document.createElement('script');
                script.textContent = scriptContent;
                document.head.appendChild(script);
                
                // 脚本执行后获取隔离的Vue实例
                script.onload = () => {
                    Logger.debug('Vue.js脚本执行完毕，获取隔离实例');
                    // 使用realWindow获取隔离的Vue实例
                    const vueInstance = realWindow.__JSREI_Vue;
                    
                    // 确保Vue实例正确加载
                    if (vueInstance && typeof vueInstance.createApp === 'function') {
                        Logger.info('Vue.js实例加载成功');
                        isolatedVue = vueInstance;
                        // 清除临时全局变量
                        delete realWindow.__JSREI_Vue;
                        // 返回隔离的Vue实例，此时isolatedVue必定非空
                        callback(isolatedVue!);
                    } else {
                        Logger.error('Vue实例加载失败或格式不正确');
                    }
                };
            } catch (error) {
                Logger.error('初始化隔离Vue实例失败:', error);
            }
        },
        onerror: function (error) {
            Logger.error('加载Vue.js失败:', error);
        },
    });
} 