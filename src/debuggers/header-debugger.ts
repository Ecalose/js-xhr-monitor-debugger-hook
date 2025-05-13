import { StringMatcher } from './string-matcher';

export const headerDebuggerTypeRequest = 'request';
export const headerDebuggerTypeResponse = 'response';

export class HeaderDebugger {
    type: string;
    onSetHeaderName: StringMatcher | null;
    onGetHeaderName: StringMatcher | null;
    onHeaderValueMatch: StringMatcher;

    constructor() {
        this.type = headerDebuggerTypeRequest;
        this.onSetHeaderName = null;
        this.onGetHeaderName = null;
        this.onHeaderValueMatch = new StringMatcher();
    }
} 