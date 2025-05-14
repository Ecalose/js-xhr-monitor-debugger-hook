/**
 * 关于标签页组件
 */

// 使用declare语句声明一个全局变量，在构建过程中会被替换为实际版本号
declare const __VERSION__: string;

/**
 * 获取应用版本号
 * 尝试从几个不同来源获取版本号
 * 如果无法获取则返回"unknown"
 */
function getVersion(): string {
    try {
        // 优先使用通过webpack定义的全局版本变量
        if (typeof __VERSION__ !== 'undefined') {
            return __VERSION__;
        }
        
        // 如果未能获取到版本号，则返回unknown
        return 'unknown';
    } catch (e) {
        // 出错时返回unknown
        return 'unknown';
    }
}

/**
 * 关于标签页模板
 */
export const aboutTemplate = `
<div class="jsrei-tab-pane">
    <h3>关于</h3>
    <div class="jsrei-about">
        <p><strong>JS-XHR-HOOK</strong></p>
        <p>一个用于监控和调试XHR请求的工具</p>
        <p>版本: ${getVersion()}</p>
        <p>
            <a href="https://github.com/JSREI/js-xhr-hook" target="_blank">GitHub仓库</a>
        </p>
        <p>
            <a href="https://github.com/JSREI/js-xhr-hook/issues" target="_blank">问题反馈</a>
        </p>
    </div>
</div>
`; 