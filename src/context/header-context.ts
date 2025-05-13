import { ContextLocation } from './context-location';
import { Header } from './header';

/**
 * 表示一个 HTTP 头部上下文
 */
export class HeaderContext {
    /**
     * 存储所有的头部信息
     */
    protected headers: Header[];

    // ContextLocation，用于表明是请求头还是响应头的上下文
    location: ContextLocation;

    constructor() {
        this.location = ContextLocation.UNKNOWN;
        this.headers = [];
    }

    /**
     * 添加一个头部
     * @param name 头部名称
     * @param value 头部值
     */
    add(name: string, value: string): void {
        const header = new Header();
        header.name = name.toLowerCase();
        header.value = value;
        header.location = this.location;
        header.isCustom = false;
        this.headers.push(header);
    }

    /**
     * 根据名称获取头部
     * @param name 头部名称
     * @returns 头部对象，如果不存在则返回 null
     */
    getByName(name: string): Header | null {
        name = name.toLowerCase();
        for (let header of this.headers) {
            if (header.name?.toLowerCase() === name) {
                return header;
            }
        }
        return null;
    }

    /**
     * 获取所有头部
     * @returns 所有头部的数组
     */
    getAll(): Header[] {
        return this.headers;
    }

    /**
     * 清空所有头部
     */
    clear(): void {
        this.headers = [];
    }
} 