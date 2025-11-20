/**
 * Error handling utilities for LootiScript
 * 
 * Provides enhanced error messages with stack traces and source context.
 */


/**
 * Call frame for stack trace
 */
export interface CallFrame {
    functionName: string;
    file: string;
    line: number;
    column: number;
}

/**
 * Base error class for LootiScript errors
 */
export class LootiScriptError extends Error {
    constructor(
        message: string,
        public file: string,
        public line: number,
        public column: number,
        public stackTrace?: CallFrame[]
    ) {
        super(message);
        this.name = 'LootiScriptError';
    }

    toString(): string {
        let msg = `${this.name}: ${this.message}\n`;
        msg += `  at ${this.file}:${this.line}:${this.column}\n`;

        if (this.stackTrace && this.stackTrace.length > 0) {
            msg += '\nStack trace:\n';
            for (const frame of this.stackTrace) {
                msg += `  at ${frame.functionName} (${frame.file}:${frame.line}:${frame.column})\n`;
            }
        }

        return msg;
    }
}

/**
 * Syntax error during parsing
 */
export class SyntaxError extends LootiScriptError {
    constructor(
        message: string,
        file: string,
        line: number,
        column: number,
        public context?: string
    ) {
        super(message, file, line, column);
        this.name = 'SyntaxError';
    }

    toString(): string {
        let msg = super.toString();

        if (this.context) {
            msg += `\n${this.context}\n`;
        }

        return msg;
    }
}

/**
 * Runtime error during execution
 */
export class RuntimeError extends LootiScriptError {
    constructor(
        message: string,
        file: string,
        line: number,
        column: number,
        stackTrace?: CallFrame[]
    ) {
        super(message, file, line, column, stackTrace);
        this.name = 'RuntimeError';
    }
}

/**
 * Type error (when type checking is enabled)
 */
export class TypeError extends LootiScriptError {
    constructor(
        message: string,
        file: string,
        line: number,
        column: number,
        public expectedType?: string,
        public actualType?: string
    ) {
        super(message, file, line, column);
        this.name = 'TypeError';
    }

    toString(): string {
        let msg = super.toString();

        if (this.expectedType && this.actualType) {
            msg += `  Expected type: ${this.expectedType}\n`;
            msg += `  Actual type: ${this.actualType}\n`;
        }

        return msg;
    }
}

/**
 * Helper to format source context around an error
 */
export function formatSourceContext(
    source: string,
    line: number,
    column: number,
    contextLines: number = 2
): string {
    const lines = source.split('\n');
    const startLine = Math.max(0, line - contextLines - 1);
    const endLine = Math.min(lines.length - 1, line + contextLines - 1);

    let context = '';

    for (let i = startLine; i <= endLine; i++) {
        const lineNum = i + 1;
        const prefix = lineNum === line ? '>' : ' ';
        const lineNumStr = String(lineNum).padStart(4, ' ');

        context += `${prefix} ${lineNumStr} | ${lines[i]}\n`;

        if (lineNum === line) {
            const pointer = ' '.repeat(8 + column) + '^';
            context += `${pointer}\n`;
        }
    }

    return context;
}

/**
 * Helper to suggest similar variable names (for "did you mean?")
 */
export function findSimilarNames(
    target: string,
    candidates: string[],
    maxDistance: number = 2
): string[] {
    const similar: Array<{ name: string; distance: number }> = [];

    for (const candidate of candidates) {
        const distance = levenshteinDistance(target, candidate);
        if (distance <= maxDistance) {
            similar.push({ name: candidate, distance });
        }
    }

    return similar
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map(s => s.name);
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
