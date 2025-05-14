import { ResponseContext } from "../context/response-context";
import { ResponseBodyParser } from "./response-body-parser";

/**
 * 响应上下文解析器
 */
export class ResponseContextParser {

    /**
     * 解析响应上下文
     * @param xhrObject {XMLHttpRequest} XHR对象
     * @returns {ResponseContext} 响应上下文
     */
    parse(xhrObject: XMLHttpRequest): ResponseContext {
        const responseContext = new ResponseContext();

        // 设置响应状态码
        responseContext.statusCode = xhrObject.status;

        // 设置响应类型
        responseContext.responseType = xhrObject.responseType;

        // 解析响应体
        responseContext.bodyContext = new ResponseBodyParser().parse(xhrObject);

        return responseContext;
    }
} 