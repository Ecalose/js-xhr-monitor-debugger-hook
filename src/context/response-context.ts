import { UrlContext } from './url-context';
import { BodyContext } from './body-context';
import { HeaderContext } from './header-context';

/**
 * 表示一个响应上下文
 */
export class ResponseContext {
    /**
     * 响应状态码
     */
    statusCode: number = 0;

    /**
     * URL上下文
     */
    urlContext: UrlContext = new UrlContext();

    /**
     * 头部上下文
     */
    headerContext: HeaderContext = new HeaderContext();

    /**
     * 响应体上下文
     */
    bodyContext: BodyContext = new BodyContext();

    /**
     * 响应类型
     */
    responseType: XMLHttpRequestResponseType = '';

    /**
     * 判断响应是否是JSON
     */
    isJson(): boolean {
        const contentType = this.headerContext.getByName('content-type');
        return contentType?.value?.toLowerCase().includes('application/json') || false;
    }
} 