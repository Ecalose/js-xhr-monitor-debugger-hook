import { MessageType, HandlerFunction, MessageField, HandlerInput, isFileReader, FileReader } from './types';

export abstract class Parser {
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

    abstract dim(text: string): string;
    abstract parseMessage(file: FileReader, gtype: string, endgroup: [number | null] | null): string;
} 