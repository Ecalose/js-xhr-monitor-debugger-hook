import { BodyContext } from '../context/body-context';
import { ContentType } from '../context/content-type';
import { ContextLocation } from '../context/context-location';

/**
 * FormData 类型的请求体解析器
 */
export class FormDataBodyParser {
    /**
     * 解析 FormData 类型的请求体
     * @param formData {FormData} FormData 对象
     * @returns {BodyContext} 解析后的请求体上下文
     */
    parse(formData: FormData): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = formData;
        bodyContext.contentType = ContentType.FORM;
        bodyContext.location = ContextLocation.REQUEST;

        formData.forEach((value, name) => {
            bodyContext.addParam(name, value instanceof File ? value.name : String(value));
        });

        return bodyContext;
    }
} 