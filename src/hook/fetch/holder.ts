import { getUnsafeWindow } from "../../utils/unsafe-window";

// 保存原始的 fetch 函数
export const ancestorFetchHolder: typeof fetch = ((getUnsafeWindow() as Window & typeof globalThis).fetch); 