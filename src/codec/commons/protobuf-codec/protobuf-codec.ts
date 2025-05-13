/**
 * ProtoBuf编解码器
 */
export class ProtoBufCodec {
    /**
     * 解码ProtoBuf数据
     * @param file 类文件对象，包含buffer和read方法
     * @returns 解码后的数据
     */
    decode(file: { buffer: Uint8Array; read: (bytes: number) => Uint8Array }): any {
        debugger;
        const parser = new StandardParser();
        const result = parser.parseMessage(file, 'message');
        console.log(result);
        return result;
    }
}

// Core 类：处理低级别的二进制数据解析
class Core {
    static readVarint(file: any): number | null {
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

    static readIdentifier(file: any): [number | null, number | null] {
        const id = Core.readVarint(file);
        if (id === null) return [null, null];
        return [id >> 3, id & 0x07];
    }

    static readValue(file: any, wireType: number): any {
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
            return new Uint8Array(c); // 使用 Uint8Array 代替 Buffer
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

// Parser 类：提供基础的解析框架
class Parser {
    types: Record<string, any>;
    nativeTypes: Record<string, any>;
    defaultIndent: string;
    compactMaxLineLength: number;
    compactMaxLength: number;
    bytesPerLine: number;
    errorsProduced: Error[];
    defaultHandler: string;
    defaultHandlers: Record<number, string>;

    constructor() {
        this.types = {};
        this.nativeTypes = {};

        this.defaultIndent = " ".repeat(4);
        this.compactMaxLineLength = 35;
        this.compactMaxLength = 70;
        this.bytesPerLine = 24;

        this.errorsProduced = [];

        this.defaultHandler = "message";
        this.defaultHandlers = {
            0: "varint",
            1: "64bit",
            2: "chunk",
            3: "startgroup",
            4: "endgroup",
            5: "32bit",
        };
    }

    indent(text: string, indent: string = this.defaultIndent): string {
        const lines = text.split("\n").map(line => line.length ? indent + line : line);
        return lines.join("\n");
    }

    toDisplayCompactly(type: string, lines: string[]): boolean {
        try {
            return this.types[type].compact;
        } catch (e) {
            // Ignore
        }

        for (const line of lines) {
            if (line.includes("\n") || line.length > this.compactMaxLineLength) return false;
        }
        return lines.reduce((sum, line) => sum + line.length, 0) <= this.compactMaxLength;
    }

    hexDump(file: Uint8Array, mark: number | null = null): [string, number] {
        const lines: string[] = [];
        let offset = 0;
        const decorate = (i: number, x: string) => (mark === null || offset + i < mark) ? x : this.dim(x);
        while (true) {
            const chunk = file.read(this.bytesPerLine);
            if (!chunk.length) break;
            const paddedChunk = [...chunk, ...Array(this.bytesPerLine - chunk.length).fill(null)];
            const hexdump = paddedChunk.map((x, i) => x === null ? "  " : decorate(i, x.toString(16).padStart(2, '0'))).join(" ");
            const printableChunk = chunk.map((x, i) => decorate(i, x >= 0x20 && x < 0x7F ? String.fromCharCode(x) : '.')).join("");
            lines.push(`${offset.toString(16).padStart(4, '0')}   ${hexdump}  ${printableChunk}`);
            offset += chunk.length;
        }
        return [lines.join("\n"), offset];
    }

    safeCall(handler: Function, x: any, ...wargs: any[]): any {
        let chunk = false;
        try {
            chunk = x.read();
            x = new Uint8Array(chunk); // 使用 Uint8Array 代替 Buffer
        } catch (e) {
            // Ignore
        }

        try {
            return handler(x, ...wargs);
        } catch (e) {
            this.errorsProduced.push(e as Error);
            const hexDump = chunk === false ? "" : `\n\n${this.hexDump(new Uint8Array(chunk), x.length)[0]}\n`;
            return `ERROR: ${this.indent((e as Error).stack || '').trim()}${this.indent(hexDump)}`;
        }
    }

    matchNativeType(type: string): [Function, number] {
        const typePrimary = type.split(" ")[0];
        return this.nativeTypes[typePrimary] || this.nativeTypes[this.defaultHandler];
    }

    matchHandler(type: string, wireType: number | null = null): Function {
        const nativeType = this.matchNativeType(type);
        if (wireType !== null && wireType !== nativeType[1]) {
            throw new Error(`Found wire type ${wireType} (${this.defaultHandlers[wireType]}), wanted type ${nativeType[1]} (${type})`);
        }
        return nativeType[0];
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

        this.types.message = {};

        this.messageCompactMaxLines = 4;
        this.packedCompactMaxLines = 20;

        this.dumpPrefix = "dump.";
        this.dumpIndex = 0;

        this.wireTypesNotMatching = false;
        this.groupsObserved = false;

        const typesToRegister = {
            0: ["varint", "sint32", "sint64", "int32", "int64", "uint32", "uint64", "enum", "bool"],
            1: ["64bit", "sfixed64", "fixed64", "double"],
            2: ["chunk", "bytes", "string", "message", "packed", "dump"],
            5: ["32bit", "sfixed32", "fixed32", "float"],
        };

        for (const [wireType, types] of Object.entries(typesToRegister)) {
            for (const type of types) {
                this.nativeTypes[type] = [this[`parse${type.charAt(0).toUpperCase() + type.slice(1)}`], parseInt(wireType)];
            }
        }
    }

    getMessageFieldEntry(gtype: string, key: number): [string | null, string | null] {
        let type = null, field = null;
        try {
            let fieldEntry = this.types[gtype][key];
            if (!Array.isArray(fieldEntry)) fieldEntry = [fieldEntry];
            [type, field] = fieldEntry;
        } catch (e) {
            // Ignore
        }
        return [type, field];
    }
}

export {
    ProtoBufCodec
}; 