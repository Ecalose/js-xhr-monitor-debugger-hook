import { XhrContext } from '../../../../context/xhr-context';
import { Header } from '../../../../context/header';
import { ContextLocation } from '../../../../context/context-location';

type ResponseHeaderMethod = 'getAllResponseHeaders' | 'getResponseHeader';

/**
 * 拦截响应头的访问
 * 
 * @param xhr XMLHttpRequest实例
 * @param context XHR上下文
 * @param method 访问方法名称
 */
export function addVisitResponseHeaderHook(
    xhr: XMLHttpRequest, 
    context: XhrContext, 
    method: ResponseHeaderMethod
): typeof xhr.getAllResponseHeaders | typeof xhr.getResponseHeader {
    if (method === 'getAllResponseHeaders') {
        return function getAllResponseHeadersHook(): string {
            const headers = xhr.getAllResponseHeaders();
            if (headers) {
                // 解析所有响应头
                const headerLines = headers.trim().split(/[\r\n]+/);
                headerLines.forEach(line => {
                    const parts = line.split(': ');
                    const name = parts.shift();
                    const value = parts.join(': ');
                    if (name && value) {
                        const header = new Header();
                        header.name = name;
                        header.value = value;
                        header.location = ContextLocation.RESPONSE;
                        context.responseContext.headerContext.add(name, value);
                    }
                });
            }
            return headers;
        };
    } else {
        return function getResponseHeaderHook(headerName: string): string | null {
            const value = xhr.getResponseHeader(headerName);
            if (value) {
                context.responseContext.headerContext.add(headerName, value);
            }
            return value;
        };
    }
} 