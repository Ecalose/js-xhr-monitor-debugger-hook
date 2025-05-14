/**
 * 存储模块
 * 
 * 该模块提供了一套统一的存储接口和多种存储实现，支持：
 * - 油猴脚本存储 (TampermonkeyStorage)
 * - IndexedDB存储 (IndexedDBStorage)
 * 
 * 基本使用:
 * ```typescript
 * // 方式1: 使用默认存储实例（油猴存储）
 * import storage from '../storage';
 * 
 * await storage.set('key', 'value');
 * const value = await storage.get<string>('key');
 * 
 * // 方式2: 使用特定存储类型
 * import { StorageFactory } from '../storage';
 * 
 * // 创建IndexedDB存储
 * const dbStorage = StorageFactory.createStorage('indexeddb');
 * await dbStorage.set('cacheData', { id: 1, name: '缓存数据' });
 * 
 * // 方式3: 直接创建存储实例
 * import { IndexedDBStorage } from '../storage';
 * 
 * const customDB = new IndexedDBStorage('customDB', 'customStore');
 * await customDB.set('appState', { isLoggedIn: true, lastAccess: new Date() });
 * ```
 */

// 导出接口
export { IStorage } from './IStorage';

// 导出存储实现
export { TampermonkeyStorage } from './TampermonkeyStorage';
export { IndexedDBStorage } from './IndexedDBStorage';

// 导出工厂和类型
export { StorageFactory, StorageType } from './StorageFactory';

// 导出默认存储实例
import defaultStorage from './StorageFactory';
export default defaultStorage; 