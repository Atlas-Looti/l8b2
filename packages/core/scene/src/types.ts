/**
 * @l8b/scene - Type definitions
 *
 * Type definitions for scene management and routing system.
 */

/**
 * Scene definition - represents a scene object from lootiscript
 * 
 * This interface matches the structure of objects passed to scene() function
 * in lootiscript files. Scenes are defined as objects with lifecycle methods.
 */
export interface SceneDefinition {
	/**
	 * Called when scene is initialized (once, on first registration)
	 */
	init?: () => void;

	/**
	 * Called when entering the scene (every time scene becomes active)
	 * @param params Route parameters extracted from the URL path
	 */
	onEnter?: (params: Record<string, string>) => void;

	/**
	 * Called when leaving the scene (before switching to another scene)
	 */
	onLeave?: () => void;

	/**
	 * Called every frame to update game logic
	 */
	update?: () => void;

	/**
	 * Called every frame to draw/render
	 */
	draw?: () => void;

	/**
	 * Called when scene is destroyed (cleanup)
	 */
	destroy?: () => void;

	/**
	 * Internal flag to track if init has been called
	 * @internal
	 */
	_initialized?: boolean;

	/**
	 * Custom properties - scenes can have any additional properties
	 */
	[key: string]: any;
}

/**
 * Route definition - maps URL paths to scene names
 */
export interface RouteDefinition {
	/** Path pattern (e.g., "/player/:id") */
	path: string;
	/** Name of the scene to activate for this route */
	sceneName: string;
	/** Compiled regex for matching paths */
	regex: RegExp;
	/** Parameter keys extracted from path pattern */
	keys: string[];
}

/**
 * Router state - current routing information
 */
export interface RouterState {
	/** Current path */
	path: string;
	/** Route parameters extracted from path */
	params: Record<string, string>;
	/** Name of currently active scene, or null if none */
	sceneName: string | null;
}

/**
 * Scene manager configuration options
 */
export interface SceneManagerOptions {
	/**
	 * Default scene to load if no route matches
	 */
	defaultScene?: string;
}

/**
 * Scene lifecycle status
 */
export type SceneStatus = "idle" | "initializing" | "active" | "paused" | "destroyed";

/**
 * Scene transition options
 */
export interface SceneTransitionOptions {
	/**
	 * Duration of the transition in milliseconds
	 */
	duration?: number;
	/**
	 * Custom transition function
	 */
	transition?: (progress: number) => number;
	/**
	 * Whether to destroy the previous scene after transition
	 */
	destroyPrevious?: boolean;
	/**
	 * Whether to pause the previous scene instead of destroying it
	 */
	pausePrevious?: boolean;
}

/**
 * Scene interface that all scenes must implement (for class-based scenes)
 */
export interface SceneInterface {
	/**
	 * Unique identifier for the scene
	 */
	readonly id: string;
	/**
	 * Current status of the scene
	 */
	readonly status: SceneStatus;
	/**
	 * Initialize the scene
	 * Called once when the scene is first created
	 * 
	 * @param data - Optional data passed from previous scene
	 */
	init?(data?: SceneData): void | Promise<void>;
	/**
	 * Update the scene
	 * Called every frame during the game loop
	 */
	update?(): void;
	/**
	 * Draw the scene
	 * Called every frame during the game loop
	 */
	draw?(): void;
	/**
	 * Called when the scene is paused
	 */
	onPause?(): void;
	/**
	 * Called when the scene is resumed
	 */
	onResume?(): void;
	/**
	 * Cleanup the scene
	 * Called when the scene is destroyed
	 */
	destroy?(): void;
}

/**
 * Data that can be passed between scenes
 */
export type SceneData = Record<string, any>;

/**
 * Scene event callbacks
 */
export interface SceneEvents {
	/**
	 * Called when scene is created
	 */
	onCreate?(): void;
	/**
	 * Called before scene starts
	 */
	onStart?(): void;
	/**
	 * Called when scene is shutdown (before destroy)
	 */
	onShutdown?(): void;
}

/**
 * Scene configuration for declarative scene definition
 */
export interface SceneConfig {
	/**
	 * Unique key for the scene
	 */
	key: string;
	/**
	 * Initialization function
	 */
	init?: (data?: SceneData) => void | Promise<void>;
	/**
	 * Update function
	 */
	update?: () => void;
	/**
	 * Draw/render function
	 */
	draw?: () => void;
	/**
	 * Called when paused
	 */
	onPause?: () => void;
	/**
	 * Called when resumed
	 */
	onResume?: () => void;
	/**
	 * Cleanup function
	 */
	destroy?: () => void;
	/**
	 * Additional event callbacks
	 */
	events?: SceneEvents;
}
