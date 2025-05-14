import { IStorage } from './IStorage';

/**
 * IndexedDB存储实现
 * 使用浏览器的IndexedDB API进行数据存储
 * 
 * 适用场景：
 * - 需要在浏览器中存储大量数据
 * - 需要结构化的查询
 * - 需要在同一域名下的不同页面之间共享数据
 * - 不依赖于油猴脚本环境
 * 
 * 存储特点：
 * - 支持大容量数据存储（通常>100MB，取决于浏览器）
 * - 支持各种数据类型，包括Blob、Files等
 * - 数据持久化，不会随页面刷新而丢失
 * - 同域限制，不同域名之间无法共享数据
 * 
 * 使用示例:
 * ```typescript
 * import { IndexedDBStorage } from './storage';
 * 
 * // 创建自定义数据库和存储的实例
 * const dbStorage = new IndexedDBStorage('myAppDB', 'userSettings');
 * 
 * // 存储复杂数据
 * await dbStorage.set('userData', {
 *   id: 10086,
 *   name: '王五',
 *   profile: {
 *     avatar: 'https://example.com/avatar.jpg',
 *     bio: '前端开发工程师',
 *     skills: ['JavaScript', 'TypeScript', 'React', 'Vue']
 *   },
 *   lastLogin: new Date(),
 *   accessLog: [
 *     { time: '2023-05-01', ip: '192.168.1.1' },
 *     { time: '2023-05-02', ip: '192.168.1.2' }
 *   ]
 * });
 * 
 * // 读取数据
 * const userData = await dbStorage.get('userData');
 * console.log(`用户: ${userData?.name}, ID: ${userData?.id}`);
 * console.log(`技能: ${userData?.profile.skills.join(', ')}`);
 * 
 * // 删除特定数据
 * await dbStorage.remove('tempCache');
 * ```
 */
export class IndexedDBStorage implements IStorage {
    private dbName: string;
    private storeName: string;
    private _dbPromise: Promise<IDBDatabase>;

    /**
     * 构造函数
     * @param dbName 数据库名称，用于在IndexedDB中唯一标识该数据库
     * @param storeName 存储名称，类似于数据库中的表名
     * 
     * @example
     * // 创建默认数据库和存储
     * const storage = new IndexedDBStorage();
     * 
     * // 创建自定义数据库和存储
     * const customStorage = new IndexedDBStorage('myApp', 'settings');
     */
    constructor(dbName: string = 'jsreiStorage', storeName: string = 'keyValueStore') {
        this.dbName = dbName;
        this.storeName = storeName;
        this._dbPromise = this._initDB();
    }

    /**
     * 初始化数据库连接
     * 该方法创建或打开IndexedDB数据库，并确保存储对象存在
     * @private
     * @returns Promise，解析为IDBDatabase实例
     */
    private async _initDB(): Promise<IDBDatabase> {
        return new Promise<IDBDatabase>((resolve, reject) => {
            // 打开指定名称的数据库，如果不存在则创建它
            const request = indexedDB.open(this.dbName, 1);

            // 处理错误
            request.onerror = () => reject(request.error);
            
            // 成功打开数据库
            request.onsuccess = () => resolve(request.result);

            // 数据库版本变更或首次创建时触发
            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                // 如果存储对象不存在，则创建它
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    /**
     * 获取存储的值
     * @param key 键名
     * @returns 返回Promise，解析为存储的值或undefined（如果不存在）
     * 
     * @example
     * // 获取用户设置
     * const settings = await storage.get<{
     *   theme: string,
     *   language: string,
     *   notifications: boolean
     * }>('settings');
     * 
     * if (settings) {
     *   applyTheme(settings.theme);
     *   setLanguage(settings.language);
     *   toggleNotifications(settings.notifications);
     * }
     */
    async get<T>(key: string): Promise<T | undefined> {
        const db = await this._dbPromise;
        return new Promise<T | undefined>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    /**
     * 设置存储的值
     * @param key 键名
     * @param value 要存储的值（几乎支持任何JS类型，包括对象、数组、日期等）
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 存储用户会话信息
     * await storage.set('session', {
     *   token: 'eyJhbGciOiJIUzI1NiIs...',
     *   expiresAt: new Date(Date.now() + 3600000),
     *   user: {
     *     id: 1234,
     *     username: 'zhang_san',
     *     permissions: ['read', 'write', 'admin']
     *   }
     * });
     */
    async set<T>(key: string, value: T): Promise<void> {
        const db = await this._dbPromise;
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * 删除某个键值对
     * @param key 要删除的键名
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 删除缓存数据
     * await storage.remove('pageCache');
     * console.log('缓存已清除');
     */
    async remove(key: string): Promise<void> {
        const db = await this._dbPromise;
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    /**
     * 清空所有存储数据
     * 警告：这将删除该存储对象中的所有数据！
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 完全重置应用状态
     * if (confirm('确定要重置所有数据吗？此操作不可撤销！')) {
     *   await storage.clear();
     *   alert('所有数据已重置，应用将刷新');
     *   location.reload();
     * }
     */
    async clear(): Promise<void> {
        const db = await this._dbPromise;
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
} 