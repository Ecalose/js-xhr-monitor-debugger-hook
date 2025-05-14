import { BodyContext } from '../context/body-context';
import { ContentType } from '../context/content-type';
import { ContextLocation } from '../context/context-location';

/**
 * FormData 类型的请求体解析器
 * 
 * 用于解析FormData类型的请求体数据，将其转换为标准的BodyContext对象。
 * 该解析器主要用于处理表单提交、文件上传等含有FormData的请求。
 * 解析过程中会遍历FormData中的所有字段，将其转换为参数列表。
 * 
 * @example
 * // 使用示例
 * const parser = new FormDataBodyParser();
 * const formData = new FormData();
 * formData.append('username', '张三');
 * formData.append('file', new File(['文件内容'], 'test.txt'));
 * const bodyContext = parser.parse(formData);
 * console.log(bodyContext.contentType); // 输出: FORM
 * console.log(bodyContext.params);      // 输出参数数组
 */
export class FormDataBodyParser {
    /**
     * 解析 FormData 类型的请求体
     * 
     * 将FormData对象解析为BodyContext对象，遍历其中的字段并转换为参数。
     * 对于普通字段，会直接使用其字符串值；对于File类型的字段，则使用文件名作为值。
     * 解析结果的contentType会被设置为FORM，位置设置为REQUEST。
     * 
     * @param formData {FormData} FormData 对象 - 需要解析的表单数据
     * @returns {BodyContext} 解析后的请求体上下文 - 包含所有表单字段和文件信息
     * 
     * @example
     * // 基本使用
     * const formData = new FormData();
     * formData.append('name', '张三');
     * formData.append('age', '25');
     * const bodyContext = parser.parse(formData);
     * 
     * @example
     * // 包含文件的表单
     * const formData = new FormData();
     * formData.append('username', 'admin');
     * formData.append('avatar', new File(['图片数据'], 'avatar.png'));
     * const bodyContext = parser.parse(formData);
     * // bodyContext.params 将包含两个参数:
     * // {name: 'username', value: 'admin'}
     * // {name: 'avatar', value: 'avatar.png'} 
     * 
     * @example
     * // 与DOM表单元素结合使用
     * const form = document.querySelector('form');
     * const formData = new FormData(form);
     * const bodyContext = parser.parse(formData);
     * // bodyContext.params 将包含表单中所有字段
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