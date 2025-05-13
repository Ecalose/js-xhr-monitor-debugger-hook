import { BodyContext } from '../context/body-context';
import { ParamContext } from '../context/param-context';
import { Param } from '../context/param';

/**
 * FormData数据解析器
 */
export class FormDataBodyParser {
    /**
     * 解析FormData数据
     * @param data FormData对象
     * @returns {BodyContext} 解析后的上下文
     */
    parse(data: FormData): BodyContext {
        const bodyContext = new BodyContext();
        const paramContext = new ParamContext();
        
        // 遍历FormData中的所有字段
        data.forEach((value, key) => {
            const param = new Param();
            param.name = key;
            param.value = value instanceof File ? value : String(value);
            paramContext.add(param);
        });
        
        bodyContext.rawBody = data;
        bodyContext.paramContext = paramContext;
        return bodyContext;
    }
} 