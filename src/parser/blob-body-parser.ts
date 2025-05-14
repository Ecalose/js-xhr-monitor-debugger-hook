import { BodyContext } from '../context/body-context';
import { ContentType } from '../context/content-type';
import { ContextLocation } from '../context/context-location';

/**
 * Blob数据解析器
 * 
 * 用于解析二进制Blob类型的请求体数据，将其转换为标准的BodyContext对象。
 * 该解析器主要用于处理二进制文件上传、图片传输等场景下的Blob数据。
 * 解析后的结果会将contentType设置为BINARY，并保存原始的Blob对象以便后续访问。
 * 
 * @example
 * // 使用示例
 * const parser = new BlobBodyParser();
 * const blob = new Blob(['Hello World'], {type: 'text/plain'});
 * const bodyContext = parser.parse(blob);
 * console.log(bodyContext.contentType);  // 输出: BINARY
 * console.log(bodyContext.blobData);     // 输出: Blob对象
 */
export class BlobBodyParser {
    /**
     * 解析Blob数据
     * 
     * 将输入的Blob对象解析为BodyContext对象，设置适当的位置、内容类型，并保存原始Blob数据。
     * 该方法不会尝试读取或转换Blob的内容，仅将其封装到BodyContext中，以便后续处理。
     * 
     * @param data {Blob} Blob对象 - 需要解析的二进制Blob数据
     * @returns {BodyContext} 解析后的上下文 - 包含Blob数据的请求体上下文
     * 
     * @example
     * // 基本使用
     * const fileBlob = new Blob([fileData], {type: 'application/pdf'});
     * const bodyContext = parser.parse(fileBlob);
     * 
     * @example
     * // 解析图片Blob
     * // 假设从canvas获取了一个图片blob
     * const canvas = document.createElement('canvas');
     * canvas.toBlob((blob) => {
     *   if (blob) {
     *     const bodyContext = parser.parse(blob);
     *     console.log(bodyContext.blobData.type); // 输出: "image/png"
     *   }
     * });
     * 
     * @example
     * // 与FormData结合使用
     * // 在实际应用中，可能从FormData中提取Blob进行解析
     * const formData = new FormData();
     * formData.append('file', new Blob(['file content']));
     * // 提取并解析
     * const fileBlob = formData.get('file') as Blob;
     * const bodyContext = parser.parse(fileBlob);
     */
    parse(data: Blob): BodyContext {
        const bodyContext = new BodyContext();
        bodyContext.rawBody = data;
        bodyContext.blobData = data;
        bodyContext.contentType = ContentType.BINARY;
        bodyContext.location = ContextLocation.REQUEST;
        return bodyContext;
    }
} 