/**
 * Diagnostic codes for L8B ecosystem
 *
 * Code format:
 * - E1xxx: Syntax errors
 * - E2xxx: Runtime errors
 * - E3xxx: Compilation errors
 * - E4xxx: Type errors
 * - E5xxx: Scene errors
 * - E6xxx: CLI errors
 * - W1xxx: Syntax warnings
 * - W2xxx: Runtime warnings
 * - W3xxx: Compilation warnings
 * - W4xxx: Type warnings
 * - W5xxx: Scene warnings
 */

/**
 * Syntax Error Codes (E1xxx)
 */
export enum SyntaxErrorCode {
	E1001 = "E1001", // Unterminated function
	E1002 = "E1002", // Too many 'end'
	E1003 = "E1003", // Missing 'end'
	E1004 = "E1004", // Unexpected token
	E1005 = "E1005", // Missing token
	E1006 = "E1006", // Unexpected end of file
	E1007 = "E1007", // Misuse of reserved keyword
	E1008 = "E1008", // Unterminated string
	E1009 = "E1009", // Unterminated object/array
}

/**
 * Runtime Error Codes (E2xxx)
 */
export enum RuntimeErrorCode {
	E2001 = "E2001", // Undefined variable
	E2002 = "E2002", // Type mismatch
	E2003 = "E2003", // Division by zero
	E2004 = "E2004", // Function not found
	E2005 = "E2005", // Invalid operation
}

/**
 * Compilation Error Codes (E3xxx)
 */
export enum CompilationErrorCode {
	E3001 = "E3001", // Compilation failed
	E3002 = "E3002", // File not found
	E3003 = "E3003", // Parse error
}

/**
 * Scene Error Codes (E5xxx)
 */
export enum SceneErrorCode {
	E5001 = "E5001", // Invalid path
	E5002 = "E5002", // Invalid scene name
	E5003 = "E5003", // Invalid scene definition
	E5004 = "E5004", // Scene not found
	E5005 = "E5005", // No route matched
	E5006 = "E5006", // No scenes registered
	E5007 = "E5007", // Scene has no draw function
}

/**
 * CLI Error Codes (E6xxx)
 */
export enum CLIErrorCode {
	E6001 = "E6001", // Config error
	E6002 = "E6002", // Build error
	E6003 = "E6003", // Server error
}

/**
 * Warning Codes (W1xxx - W5xxx)
 */
export enum WarningCode {
	// Syntax Warnings (W1xxx)
	W1001 = "W1001", // Assigning to API variable
	W1002 = "W1002", // Assignment as condition

	// Runtime Warnings (W2xxx)
	W2001 = "W2001", // Deprecated API usage

	// Scene Warnings (W5xxx)
	W5001 = "W5001", // Activating first scene
	W5002 = "W5002", // No route matched initial
	W5003 = "W5003", // No scenes registered warning
	W5004 = "W5004", // No scenes before init
}

/**
 * Union type of all error codes
 */
export type ErrorCode =
	| SyntaxErrorCode
	| RuntimeErrorCode
	| CompilationErrorCode
	| SceneErrorCode
	| CLIErrorCode;

/**
 * Union type of all diagnostic codes
 */
export type DiagnosticCode = ErrorCode | WarningCode;

