import { ParamType } from './param-type';
import { ContextLocation } from './context-location';

/**
 * 表示一个参数
 */
export class Param {
    /**
     * 参数名称
     */
    name: string | null = null;

    /**
     * 参数值
     */
    value: string | null = null;

    /**
     * 参数类型
     */
    paramType: keyof typeof ParamType = "UNKNOWN";

    /**
     * 参数位置（请求/响应）
     */
    paramLocation: symbol = ContextLocation.UNKNOWN;

    /**
     * 参数是否经过URL编码
     */
    isUrlEncoded: boolean = false;

    /**
     * URL解码后的值
     */
    urlDecodedValue: string | null = null;

    /**
     * 参数是否经过Base64编码
     */
    isBase64Encoded: boolean = false;

    /**
     * Base64解码后的值
     */
    base64DecodedValue: string | null = null;

    /**
     * 参数是否经过十六进制编码
     */
    isHexEncoded: boolean = false;

    /**
     * 十六进制解码后的值
     */
    hexDecodedValue: string | null = null;

    /**
     * 参数是否为十六进制值
     */
    isValueHex: boolean = false;

    /**
     * 十六进制值解码后的结果
     */
    valueHexDecode: string | null = null;

    /**
     * 参数是否被Base64编码
     */
    isValueBase64: boolean = false;

    /**
     * Base64解码后的值
     */
    valueBase64Decode: string | null = null;

    constructor() {
        // 表示参数的类型，参数是从哪里提取出来的
        this.paramType = "UNKNOWN";

        // 参数的位置
        this.paramLocation = ContextLocation.UNKNOWN;

        // 参数名称
        this.name = null;

        // 参数的值
        this.value = null;

        // 会分析一下value是否是url编码了
        this.isUrlEncoded = false;
        // 如果是被url编码的话则会尝试对其进行解码
        this.urlDecodedValue = null;

        // 会分析一下value是否是使用hex编码了
        this.isHexEncoded = false;
        // 如果是的话，则会尝试解码一下
        this.hexDecodedValue = null;

        // 会分析一下value是否是使用base64编码了
        this.isBase64Encoded = false;
        // 如果是的话，则会尝试解码一下
        this.base64DecodedValue = null;

        // 会分析一下value是否是十六进制值
        this.isValueHex = false;
        // 如果是的话，则会尝试解码一下
        this.valueHexDecode = null;

        // 会分析一下value是否是使用base64编码了
        this.isValueBase64 = false;
        // 如果是的话，则会尝试解码一下
        this.valueBase64Decode = null;
    }

    /**
     * 尝试获取一个最干净最还原的value
     */
    getValuePlain(): string | null {
        if (this.isBase64Encoded) {
            return this.base64DecodedValue;
        }

        if (this.isHexEncoded) {
            return this.hexDecodedValue;
        }

        if (this.isUrlEncoded && this.urlDecodedValue) {
            return this.urlDecodedValue;
        }

        if (this.isValueHex) {
            return this.valueHexDecode;
        }

        if (this.isValueBase64 && this.valueBase64Decode) {
            return this.valueBase64Decode;
        }

        return this.value;
    }
} 