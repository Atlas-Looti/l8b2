/**
 * Constants for Scene Management System
 */

import {
	SceneErrorCode,
	WarningCode,
	formatMessage,
} from "@l8b/diagnostics";

export const DEFAULT_PATH = "/";
export const PATH_SEPARATOR = "/";
export const PARAM_PATTERN = /:(\w+)/g;
export const PARAM_REPLACEMENT = "([^/]+)";

/**
 * @deprecated Use formatMessage from @l8b/diagnostics with SceneErrorCode instead
 */
export const ERROR_MESSAGES = {
	INVALID_PATH: (path: unknown) =>
		formatMessage(SceneErrorCode.E5001, { path: String(path) }),
	INVALID_SCENE_NAME: (name: unknown) =>
		formatMessage(SceneErrorCode.E5002, { name: String(name) }),
	INVALID_SCENE_DEFINITION: (name: string) =>
		formatMessage(SceneErrorCode.E5003, { name }),
	SCENE_NOT_FOUND: (name: string) =>
		formatMessage(SceneErrorCode.E5004, { name }),
	NO_ROUTE_MATCHED: (path: string) =>
		formatMessage(SceneErrorCode.E5005, { path }),
	NO_SCENES_REGISTERED: formatMessage(SceneErrorCode.E5006),
	SCENE_NO_DRAW: (name: string) =>
		formatMessage(SceneErrorCode.E5007, { name }),
} as const;

/**
 * @deprecated Use formatMessage from @l8b/diagnostics with WarningCode instead
 */
export const WARNING_MESSAGES = {
	ACTIVATING_FIRST_SCENE: (sceneName: string) =>
		formatMessage(WarningCode.W5001, { sceneName }),
	NO_ROUTE_MATCHED_INITIAL: (sceneName: string) =>
		formatMessage(WarningCode.W5002, { sceneName }),
	NO_SCENES_REGISTERED_WARNING: formatMessage(WarningCode.W5003),
	NO_SCENES_BEFORE_INIT: formatMessage(WarningCode.W5004),
} as const;

export const LOG_PREFIXES = {
	ROUTER: "[Router]",
	SCENE_MANAGER: "[SceneManager]",
} as const;

