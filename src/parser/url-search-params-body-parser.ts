import { BodyContext } from '../context/body-context';
import { ContentType } from '../context/content-type';
import { ContextLocation } from '../context/context-location';
import { ParamContext } from '../context/param-context';
import { Param } from '../context/param';
import { ParamType } from '../context/param-type';

/**
 * URLSearchParams数据解析器
 * 
 * 用于解析URLSearchParams类型的请求体数据，将其转换为标准的BodyContext对象。
 * 该解析器主要用于处理URL查询参数、以及使用application/x-www-form-urlencoded格式的表单提交。
 * 解析过程中会遍历URLSearchParams中的所有键值对，将其转换为参数列表。
 * 
 * @example
 * // 使用示例
 * const parser = new UrlSearchParamsBodyParser();
 * const params = new URLSearchParams('name=张三&age=25');
 * const bodyContext = parser.parse(params);
 * console.log(bodyContext.contentType); // 输出: FORM
 * console.log(bodyContext.paramContext.getAll().length); // 输出: 2
 */
export class UrlSearchParamsBodyParser {
    /**
     * 解析URLSearchParams数据
     * 
     * 将URLSearchParams对象解析为BodyContext对象，遍历其中的所有键值对并转换为参数。
     * 每个键值对会创建一个Param对象，设置其名称、值、类型和位置。
     * 解析结果的contentType会被设置为FORM，位置设置为REQUEST。
     * 
     * @param data {URLSearchParams} URLSearchParams对象 - 需要解析的URL参数
     * @returns {BodyContext} 解析后的上下文 - 包含所有URL参数的请求体上下文
     * 
     * @example
     * // 基本使用
     * const params = new URLSearchParams();
     * params.append('q', '搜索关键词');
     * params.append('page', '1');
     * const bodyContext = parser.parse(params);
     * 
     * @example
     * // 从URL中提取并解析参数
     * const url = new URL('https://example.com/search?q=关键词&page=1');
     * const bodyContext = parser.parse(url.searchParams);
     * 
     * @example
     * // 从字符串创建并解析
     * const paramString = 'user=admin&token=abc123';
     * const params = new URLSearchParams(paramString);
     * const bodyContext = parser.parse(params);
     * 
     * @example
     * // 处理重复的参数名
     * const params = new URLSearchParams();
     * params.append('tag', '技术');
     * params.append('tag', '编程');
     * const bodyContext = parser.parse(params);
     * // 注意：URLSearchParams允许同名参数，但在解析时后面的值会覆盖前面的值
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