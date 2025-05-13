import { ParamContext } from '../context/param-context';
import { Param } from '../context/param';
import { ParamType } from '../context/param-type';
import { ContextLocation } from '../context/context-location';

/**
 * 表单参数解析器
 */
export class FormParamParser {
    /**
     * 解析表单字符串
     * @param formString 表单字符串，示例："Uid=1111&Service=soufun-passport-web"
     * @returns {ParamContext} 包含解析结果的参数上下文
     */
    parse(formString: string): ParamContext {
        const paramContext = new ParamContext();
        
        if (!formString) {
            return paramContext;
        }

        // 按&分割参数对
        const pairs = formString.split('&');
        
        for (const pair of pairs) {
            // 按=分割参数名和参数值
            const [name, value] = pair.split('=');
            
            if (name) {
                const param = new Param();
                param.name = decodeURIComponent(name);
                param.value = value ? decodeURIComponent(value) : null;
                param.paramType = ParamType.FORM;
                param.paramLocation = ContextLocation.REQUEST;
                paramContext.add(param);
            }
        }

        return paramContext;
    }
} 