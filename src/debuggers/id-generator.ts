export class IDGenerator {
    private static counter = 0;

    static generate(): string {
        return `xhr_${++this.counter}`;
    }
} 