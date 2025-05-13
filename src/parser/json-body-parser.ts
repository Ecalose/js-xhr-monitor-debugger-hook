import { BodyContext } from "../context/body-context";
import { ContentType } from "../context/content-type";
import { ContextLocation } from "../context/context-location";

/**
 * JSON请求体解析器
 */
export class JsonBodyParser {
    /**
     * 解析JSON字符串
     * @param jsonString {string} JSON字符串
     * @return {BodyContext} 请求体上下文
     */
    parse(jsonString: string): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = jsonString;
        bodyContext.contentType = ContentType.JSON;
        bodyContext.location = ContextLocation.REQUEST;
        try {
            bodyContext.jsonData = JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            bodyContext.jsonData = null;
        }
        return bodyContext;
    }
} 