/**
 * ProtoBuf编解码器
 */
export class ProtoBufCodec {
    /**
     * 解码ProtoBuf数据
     * @param file 类文件对象，包含buffer和read方法
     * @returns 解码后的数据
     */
    decode(file: { buffer: Uint8Array; read: (bytes: number) => Uint8Array }): unknown {
        const parser = new StandardParser();
        const result = parser.parseMessage(file, 'message');
        console.log(result);
        return result;
    }
}

// Core 类：处理低级别的二进制数据解析
class Core {
    static readVarint(file: { read: (bytes: number) => Uint8Array }): number | null {
        let result = 0;
        let pos = 0;
        
        while (true) {
            const b = file.read(1);
            if (!b.length) {
                if (pos === 0) return null;
                throw new Error("Unexpected EOF");
            }
            result |= (b[0] & 0x7F) << pos;
            pos += 7;
            if (!(b[0] & 0x80)) {
                if (b[0] === 0 && pos !== 7) throw new Error("Invalid varint");
                return result;
            }
        }
    }

    static readIdentifier(file: { read: (bytes: number) => Uint8Array }): [number | null, number | null] {
        const id = Core.readVarint(file);
        if (id === null) return [null, null];
        return [id >> 3, id & 0x07];
    }

    static readValue(file: { read: (bytes: number) => Uint8Array }, wireType: number): Uint8Array | number | boolean | null {
        if (wireType === 0) {
            return Core.readVarint(file);
        } else if (wireType === 1) {
            const c = file.read(8);
            if (!c.length) return null;
            if (c.length !== 8) throw new Error("Invalid 64-bit value");
            return c;
        } else if (wireType === 2) {
            const length = Core.readVarint(file);
            if (length === null) return null;
            const c = file.read(length);
            if (c.length !== length) throw new Error("Invalid chunk length");
            return c;
        } else if (wireType === 3 || wireType === 4) {
            return wireType === 3;
        } else if (wireType === 5) {
            const c = file.read(4);
            if (!c.length) return null;
            if (c.length !== 4) throw new Error("Invalid 32-bit value");
            return c;
        } else {
            throw new Error(`Unknown wire type ${wireType}`);
        }
    }
}

// 基础类型定义
type FileReaderLike = { read: (bytes: number) => Uint8Array };

interface FileReader {
    read: (bytes: number) => Uint8Array;
    length?: number;
}

interface MessageField {
    type: string;
    name: string;
}

interface MessageType {
    compact: boolean;
    fields: Record<number, MessageField>;
}

// 解析器方法类型定义
type HandlerInput = number | string | Uint8Array | FileReader | FileReaderLike;

interface BaseParserMethod {
    (value: number): string;
}

interface HandlerFunction extends BaseParserMethod {
    (input: HandlerInput, gtype?: string, endgroup?: [number | null] | null): string;
}

// 类型检查辅助函数
function isFileReader(value: unknown): value is FileReader | FileReaderLike {
    return typeof value === 'object' && value !== null && 'read' in value && typeof (value as any).read === 'function';
}

// 类型转换辅助函数
function createMethodWrapper(method: BaseParserMethod, context: any): HandlerFunction {
    const wrapper = function(input: HandlerInput, gtype?: string, endgroup?: [number | null] | null): string {
        if (typeof input === 'number') {
            return method.call(context, input);
        }
        throw new Error('Invalid input type');
    };
    return wrapper as HandlerFunction;
}

// Parser 类：提供基础的解析框架
class Parser {
    types: Record<string, MessageType>;
    nativeTypes: Record<string, [HandlerFunction, number]>;
    defaultIndent: string;
    compactMaxLineLength: number;
    compactMaxLength: number;
    bytesPerLine: number;
    errorsProduced: Error[];
    defaultHandler: string;
    defaultHandlers: Record<string, string>;

    constructor() {
        const emptyFields: Record<number, MessageField> = Object.create(null);
        const defaultMessageType: MessageType = {
            compact: false,
            fields: emptyFields
        };

        this.types = {
            message: defaultMessageType
        };

        const defaultHandler = ((input: HandlerInput, gtype?: string, endgroup?: [number | null] | null): string => {
            if (typeof input === 'string') {
                return this.dim(input);
            }
            if (input instanceof Uint8Array) {
                return this.parseMessage({ read: () => input }, 'message', null);
            }
            if (isFileReader(input)) {
                return this.parseMessage(input as FileReader, gtype || 'message', endgroup || null);
            }
            throw new Error('Invalid input type');
        }) as HandlerFunction;

        this.nativeTypes = {
            message: [defaultHandler, 2]
        };

        this.defaultIndent = " ".repeat(4);
        this.compactMaxLineLength = 35;
        this.compactMaxLength = 70;
        this.bytesPerLine = 24;
        this.errorsProduced = [];
        this.defaultHandler = "message";
        this.defaultHandlers = {
            '0': "varint",
            '1': "64bit",
            '2': "chunk",
            '3': "startgroup",
            '4': "endgroup",
            '5': "32bit",
        };
    }

    indent(text: string, indent: string = this.defaultIndent): string {
        const lines = text.split("\n").map(line => line.length ? indent + line : line);
        return lines.join("\n");
    }

    toDisplayCompactly(type: string, lines: string[]): boolean {
        try {
            return this.types[type]?.compact ?? false;
        } catch {
            return false;
        }
    }

    hexDump(file: FileReader, mark: number | null = null): [string, number] {
        const lines: string[] = [];
        let offset = 0;
        const decorate = (i: number, x: string) => (mark === null || offset + i < mark) ? x : this.dim(x);
        
        while (true) {
            const chunk = file.read(this.bytesPerLine);
            if (!chunk.length) break;
            
            const paddedChunk = [...Array.from(chunk), ...Array(this.bytesPerLine - chunk.length).fill(null)];
            const hexdump = paddedChunk.map((x: number | null, i: number) => {
                if (x === null) return "  ";
                return decorate(i, x.toString(16).padStart(2, '0'));
            }).join(" ");
            
            const printableChunk = Array.from(chunk).map((x: number, i: number) => {
                return decorate(i, x >= 0x20 && x < 0x7F ? String.fromCharCode(x) : '.');
            }).join("");
            
            lines.push(`${offset.toString(16).padStart(4, '0')}   ${hexdump}  ${printableChunk}`);
            offset += chunk.length;
        }
        return [lines.join("\n"), offset];
    }

    safeCall<T extends { length?: number }>(
        handler: (value: T | FileReader, ...args: unknown[]) => unknown,
        x: FileReader | T,
        ...wargs: unknown[]
    ): unknown {
        let chunk: Uint8Array | null = null;
        try {
            if ('read' in x && typeof x.read === 'function') {
                chunk = x.read(1);
                if (chunk instanceof Uint8Array) {
                    x = chunk as unknown as T;
                }
            }
        } catch (_e) {
            // Ignore read errors
        }

        try {
            return handler(x, ...wargs);
        } catch (error) {
            this.errorsProduced.push(error as Error);
            const hexDump = chunk === null ? "" : `\n\n${this.hexDump({ read: () => chunk as Uint8Array }, (x as { length?: number })?.length || 0)[0]}\n`;
            return `ERROR: ${this.indent((error as Error).stack || '').trim()}${this.indent(hexDump)}`;
        }
    }

    getMessageFieldEntry(gtype: string, key: number): [string | null, string | null] {
        const type = this.types[gtype];
        if (!type || !type.fields[key]) {
            return [null, null];
        }
        const field = type.fields[key];
        return [field.type, field.name];
    }

    matchNativeType(type: string): [HandlerFunction, number] {
        const typePrimary = type.split(" ")[0];
        return this.nativeTypes[typePrimary] || this.nativeTypes[this.defaultHandler];
    }

    matchHandler(type: string, wireType: number | null = null): HandlerFunction {
        const nativeType = this.matchNativeType(type);
        if (wireType !== null && wireType !== nativeType[1]) {
            throw new Error(`Found wire type ${wireType} (${this.defaultHandlers[wireType.toString()]}), wanted type ${nativeType[1]} (${type})`);
        }
        return nativeType[0];
    }

    parseMessage(file: FileReader, gtype: string, endgroup: [number | null] | null = null): string {
        throw new Error('Method not implemented.');
    }

    dim(text: string): string {
        return text;
    }
}

// StandardParser 类：扩展 Parser，实现具体的 Protobuf 类型解析逻辑
class StandardParser extends Parser {
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

    parse64bit(value: Uint8Array): string {
        return Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    parseFixed64(value: Uint8Array): string {
        return this.parse64bit(value);
    }

    parseSfixed64(value: Uint8Array): string {
        return this.parse64bit(value);
    }

    parseDouble(value: Uint8Array): string {
        const view = new DataView(value.buffer);
        return view.getFloat64(0, true).toString();
    }

    parseChunk(value: Uint8Array): string {
        return Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    parseBytes(value: Uint8Array): string {
        return `bytes[${value.length}]`;
    }

    parseString(value: Uint8Array): string {
        return new TextDecoder().decode(value);
    }

    parsePacked(value: Uint8Array): string {
        return `packed[${value.length}]`;
    }

    parseDump(value: Uint8Array): string {
        return `dump[${value.length}]`;
    }

    parse32bit(value: Uint8Array): string {
        return Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    parseFixed32(value: Uint8Array): string {
        return this.parse32bit(value);
    }

    parseSfixed32(value: Uint8Array): string {
        return this.parse32bit(value);
    }

    parseFloat(value: Uint8Array): string {
        const view = new DataView(value.buffer);
        return view.getFloat32(0, true).toString();
    }

    override parseMessage(
        file: FileReaderLike,
        gtype: string,
        _endgroup: [number | null] | null = null
    ): string {
        if (!(gtype in this.types) && gtype !== this.defaultHandler) {
            throw new Error(`Unknown message type ${gtype}`);
        }

        const lines: string[] = [];
        const keysTypes: Record<number, number> = {};
        let key: number | null = null;
        while (true) {
            const [k, wireType] = Core.readIdentifier(file);
            key = k;
            if (key === null || wireType === null) break;

            let x: unknown = Core.readValue(file, wireType);
            if (x === null) throw new Error("Unexpected EOF");

            if (wireType === 4) {
                if (!_endgroup) throw new Error("Unexpected end group");
                _endgroup[0] = key;
                break;
            }

            if (key in keysTypes && keysTypes[key] !== wireType) {
                this.wireTypesNotMatching = true;
            }
            keysTypes[key] = wireType;

            let [type, field] = this.getMessageFieldEntry(gtype, key);
            if (wireType === 3) {
                if (type === null) type = "message";
                const end: [number | null] = [null];
                const result = this.parseMessage(file, type, end);
                x = `group (end ${end[0]}) ${result}`;
                this.groupsObserved = true;
            } else {
                if (type === null) type = this.defaultHandlers[wireType.toString()];
                const handler = this.matchHandler(type || '', wireType);
                if (x instanceof Uint8Array) {
                    x = handler(x, type || '');
                } else if (typeof x === 'string') {
                    x = handler(x, type || '');
                } else if (x && typeof x === 'object' && 'read' in x && typeof (x as { read?: unknown }).read === 'function') {
                    x = handler(x as FileReader, type || '');
                }
            }

            if (field === null) field = `<${type}>`;
            lines.push(`${key} ${field} = ${x}`);
        }

        if (key === null && _endgroup) throw new Error("Group was not ended");
        if (lines.length <= this.messageCompactMaxLines && this.toDisplayCompactly(gtype, lines)) {
            return `${gtype}(${lines.join(", ")})`;
        }
        if (!lines.length) lines.push("empty");
        return `${gtype}:\n${this.indent(lines.join("\n"))}`;
    }
} 