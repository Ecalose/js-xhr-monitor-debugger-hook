import { UrlContext } from './url-context';
import { BodyContext } from './body-context';
import { HeaderContext } from './header-context';
import { ContentType } from './content-type';

/**
 * 响应上下文
 */
export class ResponseContext {
    statusCode: number | null;
    urlContext: UrlContext;
    bodyContext: BodyContext;
    headerContext: HeaderContext;

    constructor() {
        // 响应状态码
        this.statusCode = null;

        // 可能会有重定向之类的？
        this.urlContext = new UrlContext();

        // 请求携带的请求体
        this.bodyContext = new BodyContext();

        // 请求的请求头上下文
        this.headerContext = new HeaderContext();
    }

    /**
     * 判断响应内容是否是JSON
     */
    isJson(): boolean {
        return this.bodyContext.contentType === ContentType.JSON;
    }
} 