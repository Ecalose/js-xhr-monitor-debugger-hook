import { BodyContext } from "../context/body-context";
import { ContentType } from "../context/content-type";
import { XhrContext } from "../context/xhr-context";

/**
 * 响应体解析器
 */
export class ResponseBodyParser {
    /**
     * 解析响应体
     * @param xhrObject {XMLHttpRequest} XHR对象
     * @param xhrContext {XhrContext} XHR上下文
     * @return {BodyContext} 响应体上下文
     */
    parse(xhrObject: XMLHttpRequest, xhrContext: XhrContext): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = xhrObject.response;
        bodyContext.textContent = xhrObject.responseText;

        // 尝试解析JSON
        try {
            bodyContext.jsonData = JSON.parse(xhrObject.responseText);
            bodyContext.contentType = ContentType.JSON;
        } catch (e) {
            // 如果不是JSON，则设置为纯文本
            bodyContext.contentType = ContentType.PLAINTEXT;
        }

        return bodyContext;
    }
} 