import { Header } from "../../../../context/header";
import { ContextLocation } from "../../../../context/context-location";
import { HeaderParser } from "../../../../parser/header-parser";
import { DebuggerTester } from "../../../../debuggers/debugger-tester";
import { getUserCodeLocation } from "../../../../utils/code-util";
import { XhrContext } from "../../../../context/xhr-context";

/**
 * 设置请求头的时候拦截一下
 *
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/setRequestHeader
 *
 * @param xhrObject {XMLHttpRequest}
 * @param xhrContext {XhrContext}
 * @returns {(name: string, value: string) => void}
 */
export function addSetRequestHeaderHook(
    xhrObject: XMLHttpRequest,
    xhrContext: XhrContext
): (name: string, value: string) => void {
    const originalSetRequestHeader = xhrObject.setRequestHeader.bind(xhrObject);
    
    return function setRequestHeaderHook(name: string, value: string): void {
        try {
            // 收集设置的请求头信息
            collectHeaderInformation(xhrContext, name, value);
            
            // 测试断点是否命中
            DebuggerTester.test(xhrContext);
            
            // 调用原始的setRequestHeader方法
            originalSetRequestHeader(name, value);
        } catch (error) {
            console.error('Error in setRequestHeaderHook:', error);
            throw error;
        }
    };
}

/**
 * 采集请求头信息
 *
 * @param xhrContext {XhrContext}
 * @param headerName {string}
 * @param headerValue {string}
 */
function collectHeaderInformation(
    xhrContext: XhrContext,
    headerName: string,
    headerValue: string
): void {
    try {
        const header = new Header();
        header.name = headerName;
        header.value = headerValue;
        header.location = ContextLocation.REQUEST;
        header.isCustom = !new HeaderParser().isStandardHeader(headerName);
        
        xhrContext.requestContext.headerContext.add(headerName, headerValue);
        
        // 记录自定义请求头的设置位置
        if (header.isCustom) {
            const userCodeLocation = getUserCodeLocation();
            console.log(`设置了自定义请求头: ${headerName}:${headerValue}, 代码位置: ${userCodeLocation}`);
        }
    } catch (error) {
        console.error('Error collecting header information:', error);
        throw error;
    }
} 