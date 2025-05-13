/**
 * 获取 URL 的基础路径（包括协议、域名和路径部分，但不包括文件名）。
 *
 * @param urlString - 完整的 URL 字符串，例如 "https://example.com/path/to/page.html"。
 * @return 返回 URL 的基础路径，例如 "https://example.com/path/to/"。
 */
export function urlBasePath(urlString: string): string {
    const url = new URL(urlString);
    // 获取基础路径（包括协议、域名和路径部分，但不包括文件名）
    const basePath = `${url.origin}${url.pathname.substring(0, url.pathname.lastIndexOf("/") + 1)}`;
    // console.log(basePath); // 输出: https://example.com/path/to/
    return basePath;
}

/**
 * 将URL格式化为字符串。支持多种格式：
 * 1. URL对象
 * 2. 完整的URL（以 "http://" 或 "https://" 开头）
 * 3. CDN URL（以 "//" 开头）
 * 4. 相对路径（以 "./" 开头）
 * 5. 省略域名的路径（以 "/" 开头）
 * 6. 其他相对路径
 *
 * @param url - URL对象、字符串或其他值
 * @returns 格式化后的URL字符串
 */
export function formatToUrl(url: string | URL | unknown): string {
    // 如果是URL对象，直接转换为字符串
    if (url instanceof URL) {
        return url.toString();
    }

    // 强制将输入转换为字符串
    const srcString = String(url);

    // 如果已经是完整的URL，直接返回
    if (srcString.startsWith("http://") || srcString.startsWith("https://")) {
        return srcString;
    }

    // 处理CDN URL（以"//"开头）
    if (srcString.startsWith("//")) {
        return "https:" + srcString;
    }

    // 处理相对路径（以"./"开头）
    if (srcString.startsWith("./")) {
        return urlBasePath(window.location.href) + srcString.substring(2);
    }

    // 处理省略域名的路径（以"/"开头）
    if (srcString.startsWith("/")) {
        return window.location.origin + srcString;
    }

    // 处理其他相对路径
    return window.location.origin + "/" + srcString;
} 