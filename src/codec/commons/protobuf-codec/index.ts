import { StandardParser } from './standard-parser';
import { FileReaderLike } from './types';

export * from './types';
export * from './core';
export * from './base-parser';
export * from './standard-parser';

export class ProtoBufCodec {
    /**
     * 解码ProtoBuf数据
     * @param file 类文件对象，包含buffer和read方法
     * @returns 解码后的数据
     */
    decode(file: FileReaderLike & { buffer: Uint8Array }): unknown {
        const parser = new StandardParser();
        const result = parser.parseMessage(file, 'message', null);
        console.log(result);
        return result;
    }
} 