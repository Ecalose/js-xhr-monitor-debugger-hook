import { ResponseContext } from "../context/response-context";
import { Header } from "../context/header";
import { ContextLocation } from "../context/context-location";
import { UrlContextParser } from "./url-context-parser";
import { ResponseBodyParser } from "./response-body-parser";
import { XhrContext } from "../context/xhr-context";

/**
 * 解析响应
 */
export class ResponseContextParser {
    /**
     * 解析 XHR 对象并填充 ResponseContext
     * @param {XMLHttpRequest} xhrObject - XHR 对象
     * @param {XhrContext} xhrContext - XHR 上下文
     * @return {ResponseContext} - 填充后的 ResponseContext 对象
     */
    parse(xhrObject: XMLHttpRequest, xhrContext: XhrContext): ResponseContext {
        const responseContext = new ResponseContext();

        // 设置响应状态码
        responseContext.statusCode = xhrObject.status;

        // URL
        responseContext.urlContext = new UrlContextParser().parse(xhrObject.responseURL);

        // 设置请求头上下文
        const headers = xhrObject.getAllResponseHeaders();
        if (headers) {
            const headerLines = headers.trim().split(/[\r\n]+/);
            headerLines.forEach(line => {
                const [key, value] = line.split(": ");
                const header = new Header();
                header.location = ContextLocation.RESPONSE;
                header.isCustom = false;
                header.name = key;
                header.value = value;
                responseContext.headerContext.headers.push(header);
            });
        }

        // 解析响应体
        responseContext.bodyContext = new ResponseBodyParser().parse(xhrObject, xhrContext);

        return responseContext;
    }
} 