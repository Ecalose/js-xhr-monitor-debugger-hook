/**
 * 用于生成唯一 ID
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
     * 返回下一个 ID
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