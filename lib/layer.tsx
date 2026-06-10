import Konva from "konva";
import type { Layer as KLayer, LayerConfig } from "konva/lib/Layer";
import { createContext, createEffect, onCleanup, useContext } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { useStage } from "./stage";

const LayerContext = createContext<KLayer>();

function useLayer() {
	const layer = useContext(LayerContext);

	if (!layer) {
		throw new Error("can't find a Layer");
	}

	return layer;
}

export function Layer(props: { children?: JSX.Element } & LayerConfig) {
	const layer = new Konva.Layer(props);
	const stage = useStage();

	createEffect(() => {
		const currentStage = stage?.stage();

		if (currentStage) {
			currentStage.add(layer);
		}
	});

	createEffect(() => {
		layer.setAttrs(props);
	});

	onCleanup(() => {
		layer.destroy();
	});

	return (
		// idk why, but this div fixes using <Show>
		<div>
			<LayerContext.Provider value={layer}>
				{props.children}
			</LayerContext.Provider>
		</div>
	);
}

export { LayerContext, useLayer };
