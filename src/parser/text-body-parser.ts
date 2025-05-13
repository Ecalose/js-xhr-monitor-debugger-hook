import { BodyContext } from "../context/body-context";
import { ContextLocation } from "../context/context-location";
import { ContentType } from "../context/content-type";

/**
 * 文本请求体解析器
 */
export class TextBodyParser {
    /**
     * 解析文本请求体
     * @param text {string} 文本内容
     * @return {BodyContext} 请求体上下文
     */
    parse(text: string): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.location = ContextLocation.REQUEST;
        bodyContext.rawBody = text;
        bodyContext.contentType = ContentType.PLAINTEXT;
        bodyContext.params = [];
        return bodyContext;
    }
} 