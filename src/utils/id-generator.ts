/**
 * ID生成工具
 * 提供多种ID生成方式
 */

/**
 * 用于生成有序的自增ID
 */
export class IDGenerator {
    private idPrefix: string;
    private next: number;

    /**
     * 构造函数
     * @param idPrefix 可以指定一个可选的 ID 前缀，如果指定的话生成的每个 ID 都有相同的前缀，未指定的话则 ID 无前缀只是一个自增的数字
     */
    constructor(idPrefix = "") {
        this.idPrefix = idPrefix;
        this.next = 1;
    }

    /**
     * 返回下一个自增ID
     * @returns {string | number} 自增ID，格式为 "前缀-00000001" 或纯数字
     */
    nextID(): string | number {
        const next = this.next;
        this.next++;
        if (this.idPrefix) {
            return `${this.idPrefix}-${next.toString().padStart(8, "0")}`;
        } else {
            return next;
        }
    }
}

/**
 * 生成一个随机 ID，格式类似于 UUID。
 *
 * @returns {string} - 返回一个随机生成的 ID，格式为 "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"。
 */
export function randomId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string): string {
        // 生成一个 0 到 15 的随机整数
        const r: number = Math.random() * 16 | 0;
        // 如果字符是 'x'，则直接使用随机数；如果是 'y'，则根据规则生成特定值
        const v: number = c === 'x' ? r : (r & 0x3 | 0x8);
        // 将结果转换为十六进制字符串
        return v.toString(16);
    });
} 