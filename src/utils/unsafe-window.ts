declare const unsafeWindow: Window;

/**
 * 获取不安全的窗口对象，用于访问原始的浏览器 API
 * @returns {Window} 不安全的窗口对象
 */
export function getUnsafeWindow(): Window {
    // 在油猴脚本中，通常可以通过 unsafeWindow 访问原始的窗口对象
    // 但在其他环境中，我们直接返回 window 对象
    return (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
} 