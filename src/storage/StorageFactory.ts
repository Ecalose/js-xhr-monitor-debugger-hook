import { IStorage } from './IStorage';
import { TampermonkeyStorage } from './TampermonkeyStorage';
import { IndexedDBStorage } from './IndexedDBStorage';

/**
 * 存储类型
 * - tampermonkey: 使用油猴脚本API存储
 * - indexeddb: 使用浏览器的IndexedDB存储
 */
export type StorageType = 'tampermonkey' | 'indexeddb';

/**
 * 存储工厂类
 * 用于创建不同类型的存储实例
 * 
 * 设计意图：
 * - 统一的接口：所有存储实现都遵循IStorage接口
 * - 灵活选择：可以根据运行环境选择合适的存储方式
 * - 易于扩展：可以方便地添加新的存储实现
 * 
 * 使用示例:
 * ```typescript
 * import { StorageFactory, StorageType } from './storage';
 * 
 * // 创建油猴存储
 * const tmStorage = StorageFactory.createStorage('tampermonkey');
 * await tmStorage.set('siteConfig', { autoPagination: true });
 * 
 * // 创建IndexedDB存储
 * const dbStorage = StorageFactory.createStorage('indexeddb');
 * await dbStorage.set('downloadHistory', [
 *   { id: 1, filename: '文档1.pdf', date: '2023-06-15' },
 *   { id: 2, filename: '文档2.pdf', date: '2023-06-16' }
 * ]);
 * 
 * // 在配置中选择存储方式
 * function initializeStorage(config: {storageType: StorageType}) {
 *   const storage = StorageFactory.createStorage(config.storageType);
 *   return storage;
 * }
 * 
 * // 应用中使用统一接口，不关心底层实现
 * async function saveUserData(storage: IStorage, userData: any) {
 *   await storage.set('userData', userData);
 *   console.log('用户数据已保存');
 * }
 * ```
 */
export class StorageFactory {
    /**
     * 创建一个存储实例
     * @param type 存储类型，默认为tampermonkey
     * @returns 存储实例，实现了IStorage接口
     * 
     * @example
     * // 油猴环境使用
     * const storage = StorageFactory.createStorage('tampermonkey');
     * 
     * // 普通网页环境使用
     * const storage = StorageFactory.createStorage('indexeddb');
     * 
     * // 根据环境自动选择
     * const storage = StorageFactory.createStorage(
     *   typeof GM_getValue !== 'undefined' ? 'tampermonkey' : 'indexeddb'
     * );
     */
    static createStorage(type: StorageType = 'tampermonkey'): IStorage {
        switch (type.toLowerCase() as StorageType) {
            case 'tampermonkey':
                return new TampermonkeyStorage();
            case 'indexeddb':
                return new IndexedDBStorage();
            default:
                throw new Error(`不支持的存储类型: ${type}`);
        }
    }
}

/**
 * 默认存储实例，使用油猴存储
 * 可以直接导入使用，无需创建实例
 * 
 * @example
 * import storage from './storage';
 * 
 * // 直接使用默认实例
 * await storage.set('key', 'value');
 * const value = await storage.get('key');
 */
const defaultStorage = StorageFactory.createStorage('tampermonkey');

// 导出默认存储实例
export default defaultStorage; 