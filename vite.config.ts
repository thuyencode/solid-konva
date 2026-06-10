import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import solidPlugin from "vite-plugin-solid";

const dirname =
	typeof __dirname !== "undefined"
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		solidPlugin(),
		dts({
			include: resolve(dirname, "lib"),
			outDirs: [resolve(dirname, "dist")],
			tsconfigPath: resolve(dirname, "tsconfig.json"),
		}),
	],
	build: {
		target: "esnext",
		lib: {
			entry: resolve(dirname, "lib/index.ts"),
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
		},
	},
});
