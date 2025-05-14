import { getUnsafeWindow } from "../../utils/unsafe-window";

// 保存原始的 XMLHttpRequest 对象
export const ancestorXMLHttpRequestHolder: typeof XMLHttpRequest = ((getUnsafeWindow() as Window & typeof globalThis).XMLHttpRequest); 