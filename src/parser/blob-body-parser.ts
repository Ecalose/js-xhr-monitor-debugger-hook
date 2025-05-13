import { BodyContext } from '../context/body-context';
import { ContentType } from '../context/content-type';
import { ContextLocation } from '../context/context-location';

/**
 * Blob数据解析器
 */
export class BlobBodyParser {
    /**
     * 解析Blob数据
     * @param data Blob对象
     * @returns {BodyContext} 解析后的上下文
     */
    parse(data: Blob): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = data;
        bodyContext.blobData = data;
        bodyContext.contentType = ContentType.BINARY;
        bodyContext.location = ContextLocation.REQUEST;
        return bodyContext;
    }
} 