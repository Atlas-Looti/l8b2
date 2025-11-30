import { readFileSync } from "node:fs";
import { defineConfig } from "tsup";
import { treeShakableConfig } from "../../tsup.config.base";

type PackageJson =
	{
		dependencies?: Record<
			string,
			string
		>;
		peerDependencies?: Record<
			string,
			string
		>;
	};

const pkg: PackageJson =
	JSON.parse(
		readFileSync(
			"./package.json",
			"utf-8",
		),
	);

const externalDeps =
	Array.from(
		new Set(
			[
				...Object.keys(
					pkg.dependencies ??
						{},
				),
				...Object.keys(
					pkg.peerDependencies ??
						{},
				),
			],
		),
	);

export default defineConfig(
	{
		...treeShakableConfig,
		external: externalDeps,
	},
);
