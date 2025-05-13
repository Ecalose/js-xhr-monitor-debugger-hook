import { BodyContext } from '../context/body-context';

/**
 * ArrayBuffer数据解析器
 */
export class ArrayBufferBodyParser {
    /**
     * 解析ArrayBuffer数据
     * @param data ArrayBuffer对象
     * @returns {BodyContext} 解析后的上下文
     */
    parse(data: ArrayBuffer): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = data;
        bodyContext.arrayBufferData = data;
        return bodyContext;
    }
} 