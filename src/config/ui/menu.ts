/**
 * 注册油猴脚本菜单和配置界面
 * 这是界面模块的主入口文件
 */
import { AppState } from './types';
import { addModalStyles } from './styles';
import { loadVue, Vue } from './vueLoader';
import { modalTemplate, modalMethods, tabItems } from './components/Modal';
import { xhrBreakpointsMethods, defaultXhrBreakpoints } from './components/XhrBreakpointsTab';
import { settingsMethods, defaultSettings } from './components/SettingsTab';
import { getUnsafeWindow } from '../../utils/unsafe-window';
import Logger from '../../logger/logger';

// 为Window类型扩展，添加我们的自定义属性
interface ExtendedWindow extends Window {
    __jsreiModalState?: any;
}

/**
 * 注册油猴脚本菜单
 */
function registerMenu(): void {
    Logger.info('注册油猴脚本菜单');
    GM_registerMenuCommand(
        "打开配置界面",
        function () {
            showConfigModal();
        }
    );
}

/**
 * 显示配置模态窗口
 */
function showConfigModal(): void {
    // 获取真实的页面窗口对象
    const realWindow = getUnsafeWindow() as ExtendedWindow;
    
    // 避免重复加载
    if (document.getElementById('jsrei-modal-container')) {
        if (realWindow.__jsreiModalState) {
            Logger.debug('模态窗口已存在，设置显示状态');
            realWindow.__jsreiModalState.showModal = true;
        }
        return;
    }

    Logger.info('创建配置模态窗口');
    
    // 创建一个新的DOM元素作为Vue实例的挂载点
    const modalContainer = document.createElement('div');
    modalContainer.id = 'jsrei-modal-container';
    document.body.appendChild(modalContainer);

    // 加载Vue.js
    Logger.debug('开始加载Vue.js');
    loadVue((vue) => createModalApp(vue, realWindow));
}

/**
 * 创建模态窗口Vue应用
 * @param vue 隔离的Vue实例
 * @param realWindow 真实的窗口对象
 */
function createModalApp(vue: Vue, realWindow: ExtendedWindow): void {
    Logger.debug('Vue.js加载成功，创建应用');
    const { createApp } = vue;

    // 添加模态窗口样式
    addModalStyles();

    // 合并所有方法
    const methods = {
        ...modalMethods,
        ...xhrBreakpointsMethods,
        ...settingsMethods
    };

    // 创建Vue应用
    Logger.debug('初始化Vue应用数据');
    const app = createApp({
        data(): AppState {
            return {
                showModal: true,
                activeTab: 'xhr-breakpoints',
                tabs: tabItems,
                xhrBreakpoints: defaultXhrBreakpoints,
                settings: defaultSettings
            };
        },
        methods,
        template: modalTemplate
    });

    // 挂载Vue实例
    Logger.info('挂载Vue应用到DOM');
    app.mount('#jsrei-modal-container');

    // 保存对状态的引用，便于外部访问
    try {
        if (app && '_instance' in app && app._instance && 'data' in app._instance) {
            realWindow.__jsreiModalState = app._instance.data;
            Logger.debug('已保存Vue实例状态到全局对象');
        }
    } catch (e) {
        Logger.error('无法访问Vue实例内部状态:', e);
    }
}

/**
 * 显示配置界面
 * @deprecated 使用showConfigModal代替
 */
function show(): void {
    Logger.warn('使用已废弃的show()方法，请改用showConfigModal()');
    showConfigModal();
}

export {
    registerMenu,
    showConfigModal,
    show
}; 