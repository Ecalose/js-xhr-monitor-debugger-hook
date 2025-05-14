/**
 * 请求头解析器
 * 
 * 用于解析和判断HTTP请求头的类型和标准性。
 * 根据RFC标准规范定义的HTTP标准请求头列表，判断一个请求头是否为标准HTTP请求头。
 * 
 * @example
 * // 使用示例
 * const parser = new HeaderParser();
 * const isStandard = parser.isStandardHeader('Content-Type'); // 返回 true
 * const isCustom = parser.isStandardHeader('X-Custom-Header'); // 返回 false
 */
export class HeaderParser {
    /**
     * 标准HTTP请求头列表
     * 
     * 包含RFC规范中定义的所有标准HTTP请求头名称（小写形式）。
     * 参考: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
     */
    private static readonly STANDARD_HEADERS = new Set([
        'accept',
        'accept-charset',
        'accept-encoding',
        'accept-language',
        'authorization',
        'cache-control',
        'connection',
        'content-length',
        'content-type',
        'cookie',
        'date',
        'expect',
        'from',
        'host',
        'if-match',
        'if-modified-since',
        'if-none-match',
        'if-range',
        'if-unmodified-since',
        'max-forwards',
        'pragma',
        'proxy-authorization',
        'range',
        'referer',
        'te',
        'upgrade',
        'user-agent',
        'via',
        'warning'
    ]);

    /**
     * 判断是否为标准HTTP请求头
     * 
     * 检查给定的请求头名称是否在标准HTTP请求头列表中。
     * 该方法会将输入的请求头名称转换为小写形式进行比较。
     * 
     * @param headerName {string} 请求头名称 - 要检查的HTTP请求头名称，大小写不敏感
     * @returns {boolean} 是否为标准请求头 - 如果是标准HTTP请求头则返回true，否则返回false
     * 
     * @example
     * // 标准请求头判断示例
     * isStandardHeader('Content-Type'); // 返回 true
     * isStandardHeader('X-Custom-Header'); // 返回 false
     */
    isStandardHeader(headerName: string): boolean {
        return HeaderParser.STANDARD_HEADERS.has(headerName.toLowerCase());
    }
} 