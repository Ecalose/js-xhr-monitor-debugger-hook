/**
 * JSON对象分析器
 */
export class JsonAnalyzer {

    /**
     * 深度遍历 JSON 对象
     * @param obj {Record<string, unknown>} 要遍历的对象
     * @param callback {Function} 回调函数，接收 name、path 和 value
     * @param path {string} 当前路径（用于递归）
     */
    deepTraverse(
        obj: Record<string, unknown>,
        callback: (name: string | undefined, path: string, value: unknown) => void,
        path: string = ''
    ): void {
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const newPath = path ? `${path}.${key}` : key;
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        this.deepTraverse(value as Record<string, unknown>, callback, newPath);
                    } else {
                        callback(key, newPath, value);
                    }
                }
            }
        } else {
            const name = path.split('.').pop();
            callback(name, path, obj);
        }
    }

} 