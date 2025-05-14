import { Parser } from './base-parser';
import { createMethodWrapper, BaseParserMethod } from './types';

export class StandardParser extends Parser {
    messageCompactMaxLines: number;
    packedCompactMaxLines: number;
    dumpPrefix: string;
    dumpIndex: number;
    wireTypesNotMatching: boolean;
    groupsObserved: boolean;

    constructor() {
        super();

        this.types = {
            message: {
                compact: false,
                fields: {}
            }
        };

        this.messageCompactMaxLines = 4;
        this.packedCompactMaxLines = 20;

        this.dumpPrefix = "dump.";
        this.dumpIndex = 0;

        this.wireTypesNotMatching = false;
        this.groupsObserved = false;

        const typesToRegister: Record<string, string[]> = {
            '0': ["varint", "sint32", "sint64", "int32", "int64", "uint32", "uint64", "enum", "bool"],
            '1': ["64bit", "sfixed64", "fixed64", "double"],
            '2': ["chunk", "bytes", "string", "message", "packed", "dump"],
            '5': ["32bit", "sfixed32", "fixed32", "float"],
        };

        Object.entries(typesToRegister).forEach(([wireTypeStr, types]) => {
            const wireType = Number(wireTypeStr);
            types.forEach((type: string) => {
                const methodName = `parse${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof StandardParser;
                const method = this[methodName];
                if (typeof method === 'function') {
                    this.nativeTypes[type] = [createMethodWrapper(method as BaseParserMethod, this), wireType];
                }
            });
        });
    }

    parseVarint(value: number): string {
        return value.toString();
    }

    parseSint32(value: number): string {
        return ((value >> 1) ^ -(value & 1)).toString();
    }

    parseSint64(value: number): string {
        return ((value >> 1) ^ -(value & 1)).toString();
    }

    parseInt32(value: number): string {
        return value.toString();
    }

    parseInt64(value: number): string {
        return value.toString();
    }

    parseUint32(value: number): string {
        return value.toString();
    }

    parseUint64(value: number): string {
        return value.toString();
    }

    parseEnum(value: number): string {
        return value.toString();
    }

    parseBool(value: number): string {
        return value ? 'true' : 'false';
    }

    dim(text: string): string {
        return text;
    }

    parseMessage(file: { read: (bytes: number) => Uint8Array }, gtype: string, endgroup: [number | null] | null): string {
        // 实现消息解析逻辑
        return '';
    }
} 