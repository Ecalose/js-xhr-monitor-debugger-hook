/**
 * 用于表示是在请求头还是在响应头里
 */
enum ContextLocation {
    // 未知
    UNKNOWN = "UNKNOWN",

    // 在请求中
    REQUEST = "REQUEST",

    // 在响应中
    RESPONSE = "RESPONSE"
}

export {
    ContextLocation
}; 