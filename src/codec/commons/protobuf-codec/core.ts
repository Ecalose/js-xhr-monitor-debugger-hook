import { FileReaderLike } from './types';

export class Core {
    static readVarint(file: FileReaderLike): number | null {
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

    static readIdentifier(file: FileReaderLike): [number | null, number | null] {
        const id = Core.readVarint(file);
        if (id === null) return [null, null];
        return [id >> 3, id & 0x07];
    }

    static readValue(file: FileReaderLike, wireType: number): Uint8Array | number | boolean | null {
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