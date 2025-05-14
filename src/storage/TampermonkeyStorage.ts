import { IStorage } from './IStorage';

/**
 * 油猴脚本API类型定义
 * 这些API仅在油猴脚本环境中可用
 * 详细文档: https://www.tampermonkey.net/documentation.php
 */
declare function GM_getValue<T>(key: string, defaultValue?: T): T;
declare function GM_setValue<T>(key: string, value: T): void;
declare function GM_deleteValue(key: string): void;
declare function GM_listValues(): string[];

/**
 * 油猴脚本存储实现
 * 使用GM_*系列API进行数据存储
 * 
 * 适用场景：
 * - 在油猴脚本(Tampermonkey/Greasemonkey)环境中运行的代码
 * - 需要持久化存储数据
 * - 需要在不同页面间共享数据
 * 
 * 存储限制：
 * - 受油猴脚本实现限制，一般支持存储JSON可序列化的数据
 * - 存储容量取决于浏览器实现，一般不会特别大
 * 
 * 使用示例:
 * ```typescript
 * import { TampermonkeyStorage } from './storage';
 * 
 * // 创建油猴存储实例
 * const tmStorage = new TampermonkeyStorage();
 * 
 * // 存储数据
 * await tmStorage.set('配置', {
 *   主题: '暗色',
 *   字体大小: 16,
 *   自动保存: true,
 *   最近使用: ['工具1', '工具2', '工具3']
 * });
 * 
 * // 读取数据
 * const config = await tmStorage.get<{
 *   主题: string,
 *   字体大小: number,
 *   自动保存: boolean,
 *   最近使用: string[]
 * }>('配置');
 * 
 * console.log(`当前主题: ${config?.主题}`);
 * console.log(`字体大小: ${config?.字体大小}px`);
 * 
 * // 删除数据
 * await tmStorage.remove('临时数据');
 * ```
 */
export class TampermonkeyStorage implements IStorage {
    /**
     * 获取存储的值
     * @param key 键名
     * @returns 返回Promise，解析为存储的值或undefined（如果不存在）
     * 
     * 注意：由于GM_getValue是同步API，这里包装成异步是为了统一接口
     * 
     * @example
     * const username = await storage.get<string>('username');
     * if (username) {
     *   console.log(`当前用户: ${username}`);
     * }
     */
    async get<T>(key: string): Promise<T | undefined> {
        return await GM_getValue(key);
    }

    /**
     * 设置存储的值
     * @param key 键名
     * @param value 要存储的值（任何可被JSON序列化的值）
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 存储用户偏好设置
     * await storage.set('userPreferences', {
     *   language: 'zh-CN',
     *   notifications: true,
     *   theme: 'dark'
     * });
     */
    async set<T>(key: string, value: T): Promise<void> {
        await GM_setValue(key, value);
    }

    /**
     * 删除某个键值对
     * @param key 要删除的键名
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 删除登录状态
     * await storage.remove('loginStatus');
     */
    async remove(key: string): Promise<void> {
        await GM_deleteValue(key);
    }

    /**
     * 清空所有存储数据
     * 这会删除油猴脚本存储的所有数据，请谨慎使用！
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 重置所有设置
     * await storage.clear();
     * console.log('所有设置已重置');
     */
    async clear(): Promise<void> {
        const keys = await GM_listValues();
        for (const key of keys) {
            await this.remove(key);
        }
    }
} 