import { Param } from "../context/param";

/**
 * 表单参数解析器
 * 
 * 用于解析URL编码的表单字符串中的参数。
 * 表单字符串通常遵循"name1=value1&name2=value2"的格式，
 * 该解析器负责将其分割为单独的键值对并进行URL解码。
 * 
 * @example
 * // 使用示例
 * const parser = new FormParamParser();
 * const params = parser.parse('username=admin&password=123456');
 * console.log(params); // 输出: [{name: "username", value: "admin"}, {name: "password", value: "123456"}]
 */
export class FormParamParser {

    /**
     * 解析表单字符串
     * 
     * 将表单字符串拆分为键值对，并创建对应的Param对象数组。
     * 该方法会自动进行URL解码，处理百分号编码的特殊字符。
     * 如果某个参数只有键没有值，值会被设置为空字符串。
     * 
     * @param formString {string} 表单字符串 - 要解析的表单格式字符串，如"key1=value1&key2=value2"
     * @returns {Param[]} 参数数组 - 解析后的Param对象数组
     * 
     * @example
     * // 基本解析示例
     * const formStr = 'id=123&name=John&active=true';
     * const params = parse(formStr);
     * // 返回结果:
     * // [
     * //   {name: "id", value: "123"},
     * //   {name: "name", value: "John"},
     * //   {name: "active", value: "true"}
     * // ]
     * 
     * @example
     * // 处理特殊字符示例
     * const formStr = 'query=hello%20world&tags=javascript%2Chtml';
     * const params = parse(formStr);
     * // 返回结果:
     * // [
     * //   {name: "query", value: "hello world"},
     * //   {name: "tags", value: "javascript,html"}
     * // ]
     * 
     * @example
     * // 处理空值示例
     * const formStr = 'key1=value1&key2=&key3';
     * const params = parse(formStr);
     * // 返回结果:
     * // [
     * //   {name: "key1", value: "value1"},
     * //   {name: "key2", value: ""},
     * //   {name: "key3", value: ""}
     * // ]
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