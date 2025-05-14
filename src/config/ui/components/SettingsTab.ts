/**
 * 设置标签页组件
 */
import { Settings } from '../types';

/**
 * 设置标签页模板
 */
export const settingsTemplate = `
<div class="jsrei-tab-pane">
    <h3>全局设置</h3>
    
    <div class="jsrei-settings-group">
        <div class="jsrei-setting-item">
            <label>
                <input type="checkbox" v-model="settings.darkMode" />
                深色模式
            </label>
        </div>
        
        <div class="jsrei-setting-item">
            <label>
                <input type="checkbox" v-model="settings.autoCapture" />
                自动捕获XHR请求
            </label>
        </div>
        
        <div class="jsrei-setting-item">
            <label>
                <input type="checkbox" v-model="settings.notifyOnCapture" />
                捕获时通知
            </label>
        </div>
        
        <div class="jsrei-setting-item">
            <label>
                历史记录大小限制
                <input type="number" v-model.number="settings.maxHistorySize" min="10" max="1000" />
            </label>
        </div>
    </div>
    
    <div class="jsrei-actions">
        <button class="jsrei-action-btn" @click="saveSettings">保存设置</button>
    </div>
</div>
`;

/**
 * 设置标签页方法
 */
export const settingsMethods = {
    /**
     * 保存设置
     */
    saveSettings(this: { settings: Settings }): void {
        // 这里可以添加保存设置到存储的逻辑
        alert('设置已保存！');
        
        // 实际项目中应该与存储模块集成
        // import storage from '../../../storage';
        // await storage.set('settings', this.settings);
    }
};

/**
 * 默认设置数据
 */
export const defaultSettings: Settings = {
    darkMode: false,
    autoCapture: true,
    maxHistorySize: 100,
    notifyOnCapture: true
}; 