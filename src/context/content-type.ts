/**
 * 表示内容的类型
 */
enum ContentType {
    // 未知
    UNKNOWN = "UNKNOWN",

    // 纯文本字符串
    PLAINTEXT = "PLAINTEXT",

    // JSON字符串
    JSON = "JSON",

    // XML格式
    XML = "XML",

    // 二进制
    BINARY = "BINARY",

    // 表单
    FORM = "FORM",

    // HTML
    HTML = "HTML"
}

export {
    ContentType
};