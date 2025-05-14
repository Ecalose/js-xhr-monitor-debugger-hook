import { ContextLocation } from "./context-location";
import { ContentType } from "./content-type";
import { Param } from "./param";
import { ParamType } from "./param-type";
import { ParamContext } from './param-context';

interface JsonData {
    [key: string]: unknown;
}

/**
 * 表示一个请求体或者响应体
 */
export class BodyContext {
    /**
     * 原始数据
     */
    rawBody: string | Blob | ArrayBuffer | FormData | URLSearchParams | null = null;

    /**
     * 原始数据的文本形式
     */
    rawBodyText: string | null = null;

    /**
     * 上下文位置（请求/响应）
     */
    location: symbol = ContextLocation.REQUEST;

    /**
     * 内容类型
     */
    contentType: typeof ContentType[keyof typeof ContentType] = ContentType.PLAINTEXT;

    /**
     * 参数上下文
     */
    paramContext: ParamContext | null = null;

    /**
     * JSON数据
     */
    jsonData: JsonData | null = null;

    /**
     * XML内容
     */
    xmlContent: Document | null = null;

    /**
     * 文本内容
     */
    textContent: string | null = null;

    /**
     * Blob数据
     */
    blobData: Blob | null = null;

    /**
     * ArrayBuffer数据
     */
    arrayBufferData: ArrayBuffer | null = null;

    /**
     * 对象形式的数据
     */
    object: Record<string, unknown> = {};

    // 如果是请求体的话，则在此处携带请求体里的参数
    params: Param[] = [];

    // 会分析一下rawBody是否是url编码了
    isRawBodyUrlEncode: boolean = false;
    // 如果是被url编码的话则会尝试对其进行解码
    rawBodyUrlDecode: string | null = null;

    // 会分析一下rawBody是否是使用hex编码了
    isRawBodyHex: boolean = false;
    // 如果是的话，则会尝试解码一下
    rawBodyHexDecode: string | null = null;

    // 会分析一下rawBody是否是使用base64编码了
    isRawBodyBase64: boolean = false;
    // 如果是的话，则会尝试解码一下
    rawBodyBase64Decode: string | null = null;

    constructor() {
        this.location = ContextLocation.UNKNOWN;
        this.rawBody = null;
        this.rawBodyText = null;
        this.contentType = ContentType.UNKNOWN;
        this.params = [];
        this.object = {};
        this.isRawBodyUrlEncode = false;
        this.rawBodyUrlDecode = null;
        this.isRawBodyHex = false;
        this.rawBodyHexDecode = null;
        this.isRawBodyBase64 = false;
        this.rawBodyBase64Decode = null;
    }

    /**
     * 获取原始请求体的纯文本内容
     * @returns 解码后的请求体内容
     */
    getRawBodyPlain(): string | null {
        if (this.isRawBodyBase64) {
            return this.rawBodyBase64Decode;
        }

        if (this.isRawBodyHex) {
            return this.rawBodyHexDecode;
        }

        if (this.isRawBodyUrlEncode) {
            return this.rawBodyUrlDecode;
        }

        if (typeof this.rawBody === 'string') {
            return this.rawBody;
        }

        if (this.rawBody instanceof URLSearchParams) {
            return this.rawBody.toString();
        }

        if (this.textContent) {
            return this.textContent;
        }

        return null;
    }

    /**
     * 添加参数
     * @param name 参数名
     * @param value 参数值
     */
    addParam(name: string, value: string): void {
        const param = new Param();
        param.name = name;
        param.value = value;
        param.paramType = ParamType.FORM;
        param.paramLocation = this.location;
        this.params.push(param);
    }
} 