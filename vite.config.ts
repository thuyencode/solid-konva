import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

const dirname =
	typeof __dirname !== "undefined"
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [solidPlugin()],
	build: {
		target: "esnext",
		lib: {
			entry: resolve(dirname, "lib/index.tsx"),
			name: "solid-konva",
			// the proper extensions will be added
			fileName: "solid-konva",
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["solid-js", "konva"],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					"solid-js": "Solid$$",
					konva: "Konva",
				},
			},
			plugins: [
				typescript({
					target: "es2020",
					rootDir: resolve(dirname, "./lib"),
					declaration: true,
					declarationDir: resolve(dirname, "./dist"),
					exclude: resolve(dirname, "./node_modules/**"),
					allowSyntheticDefaultImports: true,
				}),
			],
		},
	},
});
