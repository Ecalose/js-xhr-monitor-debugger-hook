import { Param } from "../context/param";

/**
 * 表单参数解析器
 */
export class FormParamParser {

    /**
     * 解析表单字符串
     * @param formString {string} 表单字符串
     * @returns {Param[]} 参数数组
     */
    parse(formString: string): Param[] {
        const params: Param[] = [];
        const pairs = formString.split('&');

        for (const pair of pairs) {
            const [name = '', value = ''] = pair.split('=');
            if (name) {
                const param = new Param();
                param.name = decodeURIComponent(name);
                param.value = value ? decodeURIComponent(value) : '';
                params.push(param);
            }
        }

        return params;
    }
} 