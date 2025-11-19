/**
 * Error handling utilities
 */

import type { ErrorInfo } from '../compiler/build-compiler';

/**
 * Format error message with file location
 */
export function formatError(error: ErrorInfo): string {
    let message = error.error;
    if (error.file) {
        message = `[${error.file}] ${message}`;
    }
    if (error.line !== undefined) {
        message += ` (line ${error.line}`;
        if (error.column !== undefined) {
            message += `, col ${error.column}`;
        }
        message += ')';
    }
    return message;
}

/**
 * Format compile error for display
 */
export function formatCompileError(
    moduleName: string,
    filename: string,
    error: ErrorInfo
): string {
    let message = `${moduleName} (${filename})\n  ${error.error}`;
    if (error.line !== undefined) {
        message += `\n  Line ${error.line}, Column ${error.column || 0}`;
    }
    return message;
}

