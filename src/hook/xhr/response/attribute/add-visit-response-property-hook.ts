import { XhrContext } from '../../../../context/xhr-context';

type ResponseProperty = 'response' | 'responseText' | 'responseType' | 'responseURL' | 'responseXML';

/**
 * 拦截响应属性的访问
 * 
 * @param xhr XMLHttpRequest实例
 * @param context XHR上下文
 * @param property 访问的属性名
 * @returns {unknown} 属性值
 */
export function addVisitResponsePropertyHook(
    xhr: XMLHttpRequest, 
    context: XhrContext, 
    property: ResponseProperty
): unknown {
    const value = xhr[property];
    
    // 只在请求完成时记录响应内容
    if (xhr.readyState === XMLHttpRequest.DONE) {
        try {
            switch (property) {
                case 'response':
                case 'responseText':
                    if (typeof value === 'string') {
                        context.responseContext.bodyContext.rawBody = value;
                    } else if (value instanceof ArrayBuffer) {
                        context.responseContext.bodyContext.rawBody = new TextDecoder().decode(value);
                    } else if (value !== null && typeof value === 'object') {
                        context.responseContext.bodyContext.rawBody = JSON.stringify(value);
                    }
                    break;
                    
                case 'responseType':
                    context.responseContext.responseType = value as XMLHttpRequestResponseType;
                    break;
                    
                case 'responseURL':
                    if (typeof value === 'string') {
                        context.responseContext.urlContext.rawUrl = value;
                    }
                    break;
                    
                case 'responseXML':
                    if (value instanceof Document) {
                        context.responseContext.bodyContext.rawBody = new XMLSerializer().serializeToString(value);
                    }
                    break;
            }
        } catch (error) {
            console.error(`Error processing ${property}:`, error);
        }
    }
    
    return value;
} 