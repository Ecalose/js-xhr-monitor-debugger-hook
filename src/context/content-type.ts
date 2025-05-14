/**
 * 表示内容的类型
 */
export const ContentType = {
    // 未知
    UNKNOWN: { value: "UNKNOWN", description: "未知类型" },

    // 纯文本字符串
    PLAINTEXT: { value: "PLAINTEXT", description: "纯文本" },

    // JSON字符串
    JSON: { value: "JSON", description: "JSON" },

    // XML格式
    XML: { value: "XML", description: "XML" },

    // 二进制
    BINARY: { value: "BINARY", description: "二进制" },

    // 表单
    FORM: { value: "FORM", description: "表单" },

    // Blob
    BLOB: { value: "BLOB", description: "Blob" },

    // ArrayBuffer
    ARRAYBUFFER: { value: "ARRAYBUFFER", description: "ArrayBuffer" }
} as const;