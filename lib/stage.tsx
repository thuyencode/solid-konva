import { createElementSize } from "@solid-primitives/resize-observer";
import Konva from "konva";
import type { Stage as KStage, StageConfig } from "konva/lib/Stage";
import {
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	onMount,
	type ParentProps,
	useContext,
} from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

function createStage(props: Omit<StageConfig, "container">) {
	const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
	const size = createElementSize(containerRef);
	const [stage, setStage] = createSignal<KStage>();

	onMount(() => {
		setStage(
			new Konva.Stage({
				width: size.width ?? undefined,
				height: size.height ?? undefined,
				container: containerRef(),
				...props,
			}),
		);
	});

	createEffect(() => {
		stage()?.setAttrs({
			width: size.width ?? undefined,
			height: size.height ?? undefined,
		});
	});

	onCleanup(() => {
		stage()?.destroy();
	});

	return {
		...props,
		ref: setContainerRef,
		containerRef,
		stage,
	};
}

const StageContext = createContext<ReturnType<typeof createStage>>();

function StageContextProvider(
	props: ParentProps<{
		stageProps: ReturnType<typeof createStage>;
	}>,
) {
	return (
		<StageContext.Provider value={props.stageProps}>
			{props.children}
		</StageContext.Provider>
	);
}

export function useStage() {
	return useContext(StageContext);
}

export function Stage(
	props: JSX.HTMLAttributes<HTMLDivElement> & Omit<StageConfig, "container">,
) {
	const stageProps = createStage({ ...props });

	return (
		<div ref={stageProps.ref} {...props}>
			<StageContextProvider stageProps={stageProps}>
				{props.children}
			</StageContextProvider>
		</div>
	);
}
