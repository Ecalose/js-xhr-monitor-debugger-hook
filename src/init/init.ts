import { XMLHttpRequestPrototypeHook } from '../hook/xhr/xml-http-request-prototype-hook';
import { registerMenu } from '../config/ui/menu';

/**
 * 初始化资源
 */
export function init(): void {
    // 注册菜单
    registerMenu();

    // 添加 XHR Hook
    new XMLHttpRequestPrototypeHook().addHook();
} 