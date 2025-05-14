import { XMLHttpRequestPrototypeHook } from '../hook/xhr/xml-http-request-prototype-hook';
import { registerMenu } from '../config/ui/menu';
import { addFetchHook } from '../hook/fetch';
import Logger from '../logger';

/**
 * 初始化资源
 */
export function init(): void {
    // 注册菜单
    registerMenu();

    try {
        // 添加 XHR Hook
        new XMLHttpRequestPrototypeHook().addHook();
        Logger.info('XHR Hook 已启用');

        // 添加 Fetch Hook
        addFetchHook();
        Logger.info('Fetch Hook 已启用');
    } catch (error) {
        Logger.error('添加Hook失败:', error);
    }
} 