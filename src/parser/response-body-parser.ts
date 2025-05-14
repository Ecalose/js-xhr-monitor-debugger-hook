import { BodyContext } from "../context/body-context";
import { ContentType } from "../context/content-type";
import { ContextLocation } from "../context/context-location";

/**
 * 响应体解析器
 */
export class ResponseBodyParser {

    /**
     * 解析响应体
     * @param xhrObject {XMLHttpRequest} XHR对象
     * @returns {BodyContext} 响应体上下文
     */
    parse(xhrObject: XMLHttpRequest): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.location = ContextLocation.RESPONSE;

        // 根据响应类型设置内容
        switch (xhrObject.responseType) {
            case 'text':
            case '':
                bodyContext.contentType = ContentType.PLAINTEXT;
                bodyContext.rawBody = xhrObject.responseText;
                break;

            case 'json':
                bodyContext.contentType = ContentType.JSON;
                bodyContext.rawBody = JSON.stringify(xhrObject.response);
                break;

            case 'blob':
                bodyContext.contentType = ContentType.BLOB;
                bodyContext.rawBody = xhrObject.response;
                break;

            case 'arraybuffer':
                bodyContext.contentType = ContentType.ARRAYBUFFER;
                bodyContext.rawBody = xhrObject.response;
                break;

            case 'document':
                bodyContext.contentType = ContentType.XML;
                if (xhrObject.responseXML) {
                    bodyContext.xmlContent = xhrObject.responseXML;
                    bodyContext.rawBody = new XMLSerializer().serializeToString(xhrObject.responseXML);
                }
                break;

            default:
                bodyContext.contentType = ContentType.UNKNOWN;
                if (typeof xhrObject.response === 'string' || 
                    xhrObject.response instanceof Blob || 
                    xhrObject.response instanceof ArrayBuffer || 
                    xhrObject.response instanceof FormData || 
                    xhrObject.response instanceof URLSearchParams) {
                    bodyContext.rawBody = xhrObject.response;
                } else {
                    bodyContext.rawBody = null;
                }
                break;
        }

        return bodyContext;
    }
} 