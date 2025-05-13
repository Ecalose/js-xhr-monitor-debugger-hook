# XHR Monitor Debugger Hook

一个用于监控和调试 XMLHttpRequest 请求的 TypeScript 库。

## 特性

- 监控所有 XMLHttpRequest 请求
- 支持请求 URL 过滤
- 支持请求参数过滤
- 支持请求头过滤
- 提供完整的请求上下文信息
- 支持动态配置更新
- 使用 TypeScript 编写，提供完整的类型定义

## 安装

```bash
npm install xhr-monitor-debugger-hook
```

## 使用方法

### 基本用法

```typescript
import { defaultDebugger } from 'xhr-monitor-debugger-hook';

// 启动调试器
defaultDebugger.start();

// 发送请求
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data');
xhr.send();

// 停止调试器
defaultDebugger.stop();
```

### 自定义配置

```typescript
import { XhrDebugger, IXhrDebuggerConfig } from 'xhr-monitor-debugger-hook';

const config: IXhrDebuggerConfig = {
    enable: true,
    enableRequestUrlFilter: true,
    requestUrlFilterCondition: 'api.example.com',
    enableRequestParamFilter: false,
    requestParamFilterCondition: '',
    enableRequestHeaderFilter: false,
    requestHeaderFilterCondition: ''
};

const debugger = new XhrDebugger(config);
debugger.start();
```

### 更新配置

```typescript
debugger.updateConfig({
    enableRequestUrlFilter: true,
    requestUrlFilterCondition: 'api.example.com'
});
```

### 获取请求上下文

```typescript
const context = debugger.getContext();
console.log(context.toString());
```

## API 文档

### XhrDebugger

主要的调试器类。

#### 方法

- `start()`: 启动调试器
- `stop()`: 停止调试器
- `updateConfig(config: Partial<IXhrDebuggerConfig>)`: 更新配置
- `getConfig()`: 获取当前配置
- `getContext()`: 获取当前上下文

### IXhrDebuggerConfig

调试器配置接口。

#### 属性

- `enable`: 是否启用调试器
- `enableRequestUrlFilter`: 是否启用请求 URL 过滤
- `requestUrlFilterCondition`: 请求 URL 过滤条件
- `enableRequestParamFilter`: 是否启用请求参数过滤
- `requestParamFilterCondition`: 请求参数过滤条件
- `enableRequestHeaderFilter`: 是否启用请求头过滤
- `requestHeaderFilterCondition`: 请求头过滤条件

## 示例

查看 [example.ts](src/example.ts) 获取更多使用示例。

## 许可证

MIT 