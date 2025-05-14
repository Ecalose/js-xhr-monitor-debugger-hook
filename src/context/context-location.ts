/**
 * 用于表示是在请求头还是在响应头里
 */
export const ContextLocation = {
    // 未知
    UNKNOWN: Symbol('UNKNOWN'),

    // 在请求中
    REQUEST: Symbol('REQUEST'),

    // 在响应中
    RESPONSE: Symbol('RESPONSE')
} as const; 