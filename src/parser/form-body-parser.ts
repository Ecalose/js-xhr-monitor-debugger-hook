import { FormParamParser } from "./form-param-parser";
import { BodyContext } from "../context/body-context";
import { ContextLocation } from "../context/context-location";
import { ContentType } from "../context/content-type";

/**
 * 表单请求体解析器
 */
export class FormBodyParser {
    /**
     * 解析表单字符串
     * @param formString {string} 示例："Uid=1111&Service=soufun-passport-web"
     * @return {BodyContext} 请求体上下文
     */
    parse(formString: string): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.location = ContextLocation.REQUEST;
        bodyContext.rawBody = formString;
        bodyContext.contentType = ContentType.FORM;
        bodyContext.params = new FormParamParser().parse(formString);
        return bodyContext;
    }
}