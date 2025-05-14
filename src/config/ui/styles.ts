/**
 * UI组件样式定义
 */

/**
 * 添加模态窗口样式到页面头部
 */
export function addModalStyles(): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .jsrei-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .jsrei-modal {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            width: 700px;
            max-width: 90%;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .jsrei-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #eee;
        }
        
        .jsrei-modal-header h2 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }
        
        .jsrei-close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        
        .jsrei-tabs {
            display: flex;
            border-bottom: 1px solid #eee;
            background: #f8f8f8;
        }
        
        .jsrei-tab-btn {
            padding: 12px 16px;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            font-size: 14px;
            color: #555;
        }
        
        .jsrei-tab-btn.active {
            border-bottom-color: #4285f4;
            color: #4285f4;
        }
        
        .jsrei-tab-content {
            padding: 20px;
            overflow-y: auto;
            max-height: 70vh;
        }
        
        .jsrei-tab-pane h3 {
            margin-top: 0;
            margin-bottom: 16px;
            color: #333;
        }
        
        .jsrei-breakpoints-list {
            margin-bottom: 20px;
        }
        
        .jsrei-breakpoint-item {
            margin-bottom: 12px;
            padding: 12px;
            border: 1px solid #eee;
            border-radius: 4px;
            background: #fafafa;
        }
        
        .jsrei-breakpoint-header {
            display: flex;
            align-items: center;
            width: 100%;
        }
        
        .jsrei-breakpoint-controls {
            width: 100%;
        }
        
        .jsrei-url-input {
            flex: 1;
            margin: 0 10px;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .jsrei-condition-input {
            width: 100%;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .jsrei-remove-btn {
            background: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
        }
        
        .jsrei-expand-btn {
            background: #757575;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            margin-right: 8px;
            cursor: pointer;
        }
        
        .jsrei-empty-list {
            padding: 20px;
            text-align: center;
            color: #888;
            background: #f5f5f5;
            border-radius: 4px;
        }
        
        .jsrei-actions {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        
        .jsrei-action-btn {
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
        }
        
        .jsrei-breakpoint-details {
            margin-top: 12px;
            padding: 12px;
            border-top: 1px solid #e0e0e0;
            background: #f5f5f5;
        }
        
        .jsrei-breakpoint-details h4 {
            margin: 8px 0;
            font-size: 14px;
            color: #444;
        }
        
        .jsrei-breakpoint-options {
            margin-bottom: 16px;
        }
        
        .jsrei-breakpoint-options label {
            display: inline-flex;
            align-items: center;
            margin-right: 16px;
            margin-bottom: 8px;
            cursor: pointer;
        }
        
        .jsrei-breakpoint-option {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .jsrei-breakpoint-option label {
            width: 140px;
            margin-right: 8px;
        }
        
        .jsrei-breakpoint-option input[type="text"] {
            flex: 1;
            min-width: 200px;
            padding: 6px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .jsrei-breakpoint-option input[type="checkbox"] {
            margin-right: 8px;
        }
        
        .jsrei-settings-group {
            background: #fafafa;
            padding: 16px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .jsrei-setting-item {
            margin-bottom: 12px;
        }
        
        .jsrei-setting-item label {
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        
        .jsrei-setting-item input[type="checkbox"] {
            margin-right: 8px;
        }
        
        .jsrei-setting-item input[type="number"] {
            width: 80px;
            margin-left: 10px;
            padding: 4px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .jsrei-about {
            line-height: 1.6;
            text-align: center;
            color: #555;
        }
        
        .jsrei-about a {
            color: #4285f4;
            text-decoration: none;
        }
    `;
    document.head.appendChild(styleElement);
} 