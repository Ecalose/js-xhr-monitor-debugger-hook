import { getUnsafeWindow } from '../../utils/scope-util';

// 持有一份最纯净的原型
export const ancestorXMLHttpRequestHolder: typeof XMLHttpRequest = getUnsafeWindow().XMLHttpRequest; 