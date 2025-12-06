/**
 * Hashing utilities for L8B framework
 */
import { createHash } from "node:crypto";

/**
 * Generate a simple hash from content
 */
export function hashContent(content: string | Buffer): string {
	return createHash("md5").update(content).digest("hex").slice(0, 8);
}

/**
 * Generate version number from file content
 * Returns timestamp-like number for versioning
 */
export function generateVersion(content: string | Buffer): number {
	const hash = hashContent(content);
	// Convert first 8 chars of hash to number
	return Number.parseInt(hash, 16) % 100000000;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
	return Math.random().toString(36).slice(2, 11);
}

/**
 * Create a cache key from multiple parts
 */
export function createCacheKey(...parts: string[]): string {
	return hashContent(parts.join(":"));
}

/**
 * Generate hash from file stream
 */
export async function hashFile(filePath: string): Promise<string> {
	const { createReadStream } = await import("node:fs");
	const { pipeline } = await import("node:stream/promises");
	const hash = createHash("md5");
	const input = createReadStream(filePath);

	await pipeline(input, hash);
	return hash.digest("hex").slice(0, 8);
}

/**
 * Generate version number from file path
 */
export async function generateFileVersion(filePath: string): Promise<number> {
	const hash = await hashFile(filePath);
	return Number.parseInt(hash, 16) % 100000000;
}
