/**
 * 请求头解析器
 */
export class HeaderParser {
    /**
     * 标准HTTP请求头列表
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
     * @param headerName 请求头名称
     * @returns {boolean} 是否为标准请求头
     */
    isStandardHeader(headerName: string): boolean {
        return HeaderParser.STANDARD_HEADERS.has(headerName.toLowerCase());
    }
} 