import { BaseMessage } from "../../base-message";
import { getUserCodeLocation } from "../../../utils/code-util";
import { XhrContext } from "../../../context/xhr-context";

/**
 * 打开连接消息格式化器
 */
export class OpenMessage extends BaseMessage {
    /**
     * 打印打开连接的信息
     * @param xhrContext {XhrContext} XHR上下文
     */
    static print(xhrContext: XhrContext): void {
        console.log("打开了连接: " + xhrContext.requestContext.urlContext.rawUrl + ", 代码位置： " + getUserCodeLocation());
    }
} 