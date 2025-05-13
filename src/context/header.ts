import { ContextLocation } from './context-location';

/**
 * 用于表示一个请求头或响应头
 */
export class Header {
    // HeaderLocation类型，用于表示这个头所处的位置
    location: symbol;

    // 请求头的名称
    name: string | null;

    // 请求头的值
    value: string | null;

    // 此请求头或响应头是否是自定义的
    isCustom: boolean | null;

    constructor() {
        this.location = ContextLocation.UNKNOWN;
        this.name = null;
        this.value = null;
        this.isCustom = null;
    }
} 