// 基础类型定义
export type FileReaderLike = { read: (bytes: number) => Uint8Array };

export interface FileReader {
    read: (bytes: number) => Uint8Array;
    length?: number;
}

export interface MessageField {
    type: string;
    name: string;
}

export interface MessageType {
    compact: boolean;
    fields: Record<number, MessageField>;
}

// 解析器方法类型定义
export type HandlerInput = number | string | Uint8Array | FileReader | FileReaderLike;

export interface BaseParserMethod {
    (value: number): string;
}

export interface HandlerFunction extends BaseParserMethod {
    (input: HandlerInput, gtype?: string, endgroup?: [number | null] | null): string;
}

// 类型检查辅助函数
export function isFileReader(value: unknown): value is FileReader | FileReaderLike {
    return typeof value === 'object' && value !== null && 'read' in value && typeof (value as any).read === 'function';
}

// 类型转换辅助函数
export function createMethodWrapper(method: BaseParserMethod, context: any): HandlerFunction {
    const wrapper = function(input: HandlerInput, gtype?: string, endgroup?: [number | null] | null): string {
        if (typeof input === 'number') {
            return method.call(context, input);
        }
        throw new Error('Invalid input type');
    };
    return wrapper as HandlerFunction;
} 