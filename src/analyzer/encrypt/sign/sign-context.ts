/**
 * 签名上下文
 */
export class SignContext {
    /**
     * 签名参数名称
     */
    name: string;

    /**
     * 签名参数值
     */
    value: string;

    /**
     * 创建签名上下文
     * @param name {string} 签名参数名称
     * @param value {string} 签名参数值
     */
    constructor(name: string = '', value: string = '') {
        this.name = name;
        this.value = value;
    }
} 