/**
 * API definitions index - combines all API categories
 */

import type { GlobalApi } from "../types";
import { coreApi } from "./core";
import { screenApi } from "./screen";
import { audioApi } from "./audio";
import { inputApi } from "./input";
import { systemApi } from "./system";

/**
 * Global API list for suggestions and hover info
 */
export const GLOBAL_API: GlobalApi = {
	...coreApi,
	...screenApi,
	...audioApi,
	...inputApi,
	...systemApi,
} as GlobalApi;

/**
 * Regex to match API access patterns (e.g., "screen.drawSprite", "Math.abs")
 */
export const API_ACCESS_REGEX = /\b([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z_][A-Za-z0-9_]*)\b/g;

