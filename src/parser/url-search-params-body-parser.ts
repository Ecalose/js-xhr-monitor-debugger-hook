import { BodyContext } from '../context/body-context';
import { ContentType } from '../context/content-type';
import { ContextLocation } from '../context/context-location';
import { ParamContext } from '../context/param-context';
import { Param } from '../context/param';
import { ParamType } from '../context/param-type';

/**
 * URLSearchParams数据解析器
 */
export class UrlSearchParamsBodyParser {
    /**
     * 解析URLSearchParams数据
     * @param data URLSearchParams对象
     * @returns {BodyContext} 解析后的上下文
     */
    parse(data: URLSearchParams): BodyContext {
        const bodyContext = new BodyContext();
        const paramContext = new ParamContext();
        
        // 遍历URLSearchParams中的所有参数
        data.forEach((value, key) => {
            const param = new Param();
            param.name = key;
            param.value = value;
            param.paramType = ParamType.FORM;
            param.paramLocation = ContextLocation.REQUEST;
            paramContext.add(param);
        });
        
        bodyContext.rawBody = data;
        bodyContext.paramContext = paramContext;
        bodyContext.contentType = ContentType.FORM;
        bodyContext.location = ContextLocation.REQUEST;
        return bodyContext;
    }
} 