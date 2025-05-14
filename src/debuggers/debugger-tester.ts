import { XhrContext } from "../context/xhr-context";

/**
 * 调试器测试类
 */
export class DebuggerTester {
    /**
     * 测试调试器
     * @param xhrContext XHR上下文对象
     */
    static test(xhrContext: XhrContext): void {
        // 在此处添加测试逻辑
        console.log('Testing debugger with context:', xhrContext);
    }
} 