import pako from 'pako';

/**
 * Gzip 编解码器
 */
export class GzipCodec {

    /**
     * 检查数据是否是 gzip 压缩的
     * @param data {Uint8Array} 要检查的数据
     * @returns {boolean} 是否是 gzip 压缩的数据
     */
    static isGzipCompressed(data: Uint8Array): boolean {
        // Gzip 魔数是 1f 8b
        return data.length > 2 && data[0] === 0x1f && data[1] === 0x8b;
    }

    /**
     * 解码 gzip 压缩的数据
     * @param data {Uint8Array} 要解码的数据
     * @returns {Uint8Array} 解码后的数据
     */
    static decode(data: Uint8Array): Uint8Array {
        try {
            return pako.inflate(data);
        } catch (e) {
            console.error('Error decompressing gzip data:', e);
            return data;
        }
    }
}