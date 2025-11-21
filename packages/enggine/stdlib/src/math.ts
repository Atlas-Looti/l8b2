/**
 * Math utilities for LootiScript
 *
 * Provides mathematical functions and game-specific helpers.
 */

export const MathLib = {
	// Basic math functions
	abs: (x: number): number => Math.abs(x),
	sqrt: (x: number): number => Math.sqrt(x),
	floor: (x: number): number => Math.floor(x),
	ceil: (x: number): number => Math.ceil(x),
	round: (x: number): number => Math.round(x),

	// Min/max
	min: (...args: number[]): number => Math.min(...args),
	max: (...args: number[]): number => Math.max(...args),

	// Power and exponentials
	pow: (base: number, exp: number): number => Math.pow(base, exp),
	exp: (x: number): number => Math.exp(x),
	log: (x: number): number => Math.log(x),
	log10: (x: number): number => Math.log10(x),

	// Trigonometry (in radians)
	sin: (x: number): number => Math.sin(x),
	cos: (x: number): number => Math.cos(x),
	tan: (x: number): number => Math.tan(x),
	asin: (x: number): number => Math.asin(x),
	acos: (x: number): number => Math.acos(x),
	atan: (x: number): number => Math.atan(x),
	atan2: (y: number, x: number): number => Math.atan2(y, x),

	// Random
	random: (): number => Math.random(),
	randomInt: (min: number, max: number): number =>
		Math.floor(Math.random() * (max - min + 1)) + min,
	randomFloat: (min: number, max: number): number =>
		Math.random() * (max - min) + min,

	// Constants
	PI: Math.PI,
	E: Math.E,

	// Game-specific utilities
	clamp: (value: number, min: number, max: number): number =>
		Math.min(Math.max(value, min), max),

	lerp: (a: number, b: number, t: number): number => a + (b - a) * t,

	distance: (x1: number, y1: number, x2: number, y2: number): number =>
		Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),

	distance3D: (
		x1: number,
		y1: number,
		z1: number,
		x2: number,
		y2: number,
		z2: number,
	): number => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2),

	angleBetween: (x1: number, y1: number, x2: number, y2: number): number =>
		Math.atan2(y2 - y1, x2 - x1),

	// Degrees/radians conversion
	degToRad: (degrees: number): number => degrees * (Math.PI / 180),
	radToDeg: (radians: number): number => radians * (180 / Math.PI),

	// Sign and comparison
	sign: (x: number): number => Math.sign(x),

	// Modulo that handles negative numbers correctly (Euclidean modulo)
	mod: (n: number, m: number): number => ((n % m) + m) % m,
};
