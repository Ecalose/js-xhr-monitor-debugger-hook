import { Param } from './param';

/**
 * UrlContext 类
 * 用于表示与 URL 相关的上下文信息。
 * 该类封装了 URL 的各个组成部分，方便对 URL 进行解析和操作。
 */
class UrlContext {
    /**
     * 原始 URL
     */
    rawUrl: string | null;

    /**
     * 域名
     */
    domain: string | null;

    /**
     * 端口
     */
    port: number | null;

    /**
     * 协议
     */
    protocol: string | null;

    /**
     * 查询字符串
     */
    queryString: string | null;

    /**
     * 请求路径
     */
    requestPath: string | null;

    /**
     * URL 参数
     */
    params: Param[];

    /**
     * 构造函数
     * 初始化 UrlContext 实例，设置 URL 相关的属性。
     */
    constructor() {
        this.rawUrl = null;
        this.domain = null;
        this.port = null;
        this.protocol = null;
        this.queryString = null;
        this.requestPath = null;
        this.params = [];
    }

    /**
     * 设置 URL
     * @param url URL 字符串
     */
    setUrl(url: string): void {
        this.rawUrl = url;
        try {
            const urlObj = new URL(url);
            this.domain = urlObj.hostname;
            this.port = urlObj.port ? parseInt(urlObj.port) : null;
            this.protocol = urlObj.protocol.slice(0, -1); // 移除末尾的 ':'
            this.queryString = urlObj.search.slice(1); // 移除开头的 '?'
            this.requestPath = urlObj.pathname;

            // 解析查询参数
            this.params = [];
            urlObj.searchParams.forEach((value, name) => {
                const param = new Param();
                param.name = name;
                param.value = value;
                this.params.push(param);
            });
        } catch (e) {
            console.error('Failed to parse URL:', e);
        }
    }

    /**
     * 清空 URL 信息
     */
    clear(): void {
        this.rawUrl = null;
        this.domain = null;
        this.port = null;
        this.protocol = null;
        this.queryString = null;
        this.requestPath = null;
        this.params = [];
    }

    /**
     * 获取完整的 URL
     */
    getFullUrl(): string | null {
        return this.rawUrl;
    }
}

export {
    UrlContext
}; 