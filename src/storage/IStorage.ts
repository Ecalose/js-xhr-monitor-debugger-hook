/**
 * 存储接口定义
 * 所有存储实现必须遵循此接口
 * 
 * 该接口提供了统一的异步存储操作方法，包括：获取、设置、删除和清空数据
 * 
 * 基本使用示例:
 * ```typescript
 * // 假设storage是IStorage的实现实例
 * // 存储简单数据
 * await storage.set('username', '张三');
 * 
 * // 存储复杂数据
 * await storage.set('userInfo', {
 *   id: 1001,
 *   name: '张三',
 *   age: 28,
 *   roles: ['admin', 'editor']
 * });
 * 
 * // 获取数据并指定类型
 * const username = await storage.get<string>('username');
 * const userInfo = await storage.get<{id: number, name: string, age: number, roles: string[]}>('userInfo');
 * 
 * // 删除数据
 * await storage.remove('username');
 * 
 * // 清空所有数据
 * await storage.clear();
 * ```
 */
export interface IStorage {
    /**
     * 获取存储的值
     * @param key 键名
     * @returns 返回Promise，解析为存储的值或undefined（如果不存在）
     * 
     * @example
     * // 获取简单类型
     * const name = await storage.get<string>('name');
     * 
     * // 获取对象类型
     * const config = await storage.get<{theme: string, fontSize: number}>('config'); 
     */
    get<T>(key: string): Promise<T | undefined>;
    
    /**
     * 设置存储的值
     * @param key 键名
     * @param value 要存储的值（支持各种类型，包括对象、数组等）
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 存储字符串
     * await storage.set('name', '李四');
     * 
     * // 存储对象
     * await storage.set('settings', {darkMode: true, fontSize: 16}); 
     */
    set<T>(key: string, value: T): Promise<void>;
    
    /**
     * 删除某个键值对
     * @param key 要删除的键名
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * await storage.remove('tempData');
     */
    remove(key: string): Promise<void>;
    
    /**
     * 清空所有存储数据
     * @returns 返回Promise，表示操作完成
     * 
     * @example
     * // 慎用！这将删除所有存储的数据
     * await storage.clear();
     */
    clear(): Promise<void>;
} 