/**
 * Constants for Scene Management System
 */

export const DEFAULT_PATH = "/";
export const PATH_SEPARATOR = "/";
export const PARAM_PATTERN = /:(\w+)/g;
export const PARAM_REPLACEMENT = "([^/]+)";

export const ERROR_MESSAGES = {
	INVALID_PATH: (path: unknown) => `Invalid path: ${path}`,
	INVALID_SCENE_NAME: (name: unknown) => `Invalid scene name: ${name}`,
	INVALID_SCENE_DEFINITION: (name: string) =>
		`Invalid scene definition for '${name}'`,
	SCENE_NOT_FOUND: (name: string) => `Scene not found: ${name}`,
	NO_ROUTE_MATCHED: (path: string) => `No route matched for path: ${path}`,
	NO_SCENES_REGISTERED: "No scenes registered",
	SCENE_NO_DRAW: (name: string) => `Scene '${name}' has no draw() function`,
} as const;

export const WARNING_MESSAGES = {
	ACTIVATING_FIRST_SCENE: (sceneName: string) =>
		`Activating first available scene: ${sceneName}`,
	NO_ROUTE_MATCHED_INITIAL: (sceneName: string) =>
		`No route matched initial path, activating first scene: ${sceneName}`,
	NO_SCENES_REGISTERED_WARNING: "No scenes registered. Game may show blank screen.",
	NO_SCENES_BEFORE_INIT:
		"No scenes registered. Make sure to call scene() before router.init().",
} as const;

export const LOG_PREFIXES = {
	ROUTER: "[Router]",
	SCENE_MANAGER: "[SceneManager]",
} as const;

