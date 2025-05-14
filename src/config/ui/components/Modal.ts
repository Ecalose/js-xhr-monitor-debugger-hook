/**
 * 模态窗口组件
 */
import { TabItem } from '../types';
import { xhrBreakpointsTemplate } from './XhrBreakpointsTab';
import { settingsTemplate } from './SettingsTab';
import { aboutTemplate } from './AboutTab';

/**
 * 标签页配置
 */
export const tabItems: TabItem[] = [
    { id: 'xhr-breakpoints', name: 'XHR断点' },
    { id: 'settings', name: '设置' },
    { id: 'about', name: '关于' }
];

/**
 * 获取标签页模板内容
 * @param tabId 标签页ID
 * @returns 对应的模板字符串
 */
export function getTabTemplate(tabId: string): string {
    switch (tabId) {
        case 'xhr-breakpoints':
            return xhrBreakpointsTemplate;
        case 'settings':
            return settingsTemplate;
        case 'about':
            return aboutTemplate;
        default:
            return '<div>未知标签页</div>';
    }
}

/**
 * 模态窗口模板
 */
export const modalTemplate = `
<div v-if="showModal" class="jsrei-modal-overlay">
    <div class="jsrei-modal">
        <div class="jsrei-modal-header">
            <h2>JS-XHR-HOOK 配置</h2>
            <button class="jsrei-close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="jsrei-tabs">
            <button 
                v-for="tab in tabs" 
                :key="tab.id" 
                :class="['jsrei-tab-btn', { active: activeTab === tab.id }]"
                @click="switchTab(tab.id)"
            >
                {{ tab.name }}
            </button>
        </div>
        
        <div class="jsrei-tab-content">
            <div v-if="activeTab === 'xhr-breakpoints'">
                ${xhrBreakpointsTemplate}
            </div>
            
            <div v-if="activeTab === 'settings'">
                ${settingsTemplate}
            </div>
            
            <div v-if="activeTab === 'about'">
                ${aboutTemplate}
            </div>
        </div>
    </div>
</div>
`;

/**
 * 模态窗口方法
 */
export const modalMethods = {
    /**
     * 关闭模态窗口
     */
    closeModal(this: { showModal: boolean }): void {
        this.showModal = false;
    },

    /**
     * 切换标签页
     * @param tabId 标签页ID
     */
    switchTab(this: { activeTab: string }, tabId: string): void {
        this.activeTab = tabId;
    }
}; 