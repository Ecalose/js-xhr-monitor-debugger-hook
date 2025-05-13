import pako from 'pako';

/**
 * 用来对gzip类型的数据解码
 */
class GzipCodec {

    /**
     * 解码gzip压缩的数据
     * @param gzipData {Uint8Array} gzip压缩的数据
     * @return {Uint8Array} 解压缩后的数据
     */
    static decode(gzipData: Uint8Array): Uint8Array {
        return pako.inflate(gzipData);
    }

    /**
     * 判断数据是否是gzip压缩的
     * @param uint8Array {Uint8Array} 要检查的数据
     * @return {boolean} 如果是gzip压缩的数据返回true，否则返回false
     */
    static isGzipCompressed(uint8Array: Uint8Array): boolean {
        // 检查前两个字节是否是 Gzip 文件头
        return uint8Array.length >= 2 && uint8Array[0] === 0x1F && uint8Array[1] === 0x8B;
    }

}

export {
    GzipCodec
};