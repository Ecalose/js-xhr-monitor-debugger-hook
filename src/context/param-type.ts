/**
 * 表示参数的类型
 */
enum ParamType {
    // 未知，暂不支持的参数类型
    UNKNOWN = "UNKNOWN",

    // 表单参数
    FORM = "FORM",

    // 从query string中提取出来的参数
    QUERY_STRING = "QUERY_STRING",

    // JSON类型的参数
    JSON = "JSON",

    // XML参数
    XML = "XML"
}

export {
    ParamType
}; 