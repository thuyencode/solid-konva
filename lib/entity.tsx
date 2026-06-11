import Konva from "konva";
import type { ShapeConfig } from "konva/lib/Shape";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useLayer } from "./layer";
import type { KonvaEvents } from "./types";

const propsToSkip: Record<string, true> = {
	children: true,
	ref: true,
	key: true,
	style: true,
	forwardedRef: true,
	unstable_applyCache: true,
	unstable_applyDrawHitFromCache: true,
};

function toKonvaEvent(key: string): string {
	const name = key.slice(2).toLowerCase();
	if (key.startsWith("onContent")) {
		return "content" + key.slice(10);
	}
	return name;
}

type KonvaConfig<T> = T extends new (
	...args: any[]
) => any
	? NonNullable<ConstructorParameters<T>[0]>
	: {};

type ShapeConstructors = {
	[K in keyof typeof Konva]: (typeof Konva)[K] extends new (
		...args: any[]
	) => Konva.Shape | Konva.Group
		? K
		: never;
}[keyof typeof Konva];

export function createEntity<
	T = {},
	K extends ShapeConstructors = ShapeConstructors,
>(shapeName: K) {
	type ShapeConfigType = ShapeConfig &
		KonvaEvents &
		T &
		KonvaConfig<(typeof Konva)[K]>;

	function Entity(props: ShapeConfigType) {
		let prevProps: Partial<ShapeConfigType> = {};

		const [entity, setEntity] = createSignal<Konva.Shape>();
		const layer = useLayer();

		onMount(() => {
			const _entity = new Konva[shapeName](props);
			setEntity(_entity);
			layer?.add(_entity);
		});

		createEffect(() => {
			const currentEntity = entity();

			if (!currentEntity) {
				return;
			}

			currentEntity.setAttrs(props);
		});

		createEffect(() => {
			const currentEntity = entity();

			if (!currentEntity) {
				return;
			}

			if (prevProps) {
				for (const key in prevProps) {
					if (propsToSkip[key]) {
						continue;
					}

					const isEvent = key.slice(0, 2) === "on";
					const propChanged = prevProps[key] !== props[key];

					// if that is a changed event, we need to remove it
					if (isEvent && propChanged) {
						currentEntity.off(toKonvaEvent(key), prevProps[key]);
					}

					const toRemove = !Object.hasOwn(props, key);

					if (toRemove) {
						currentEntity.setAttr(key, undefined);
					}
				}
			}

			const newEvents: Record<string, () => void> = {};

			for (const key in props) {
				if (propsToSkip[key]) {
					continue;
				}
				const isEvent = key.slice(0, 2) === "on";
				const toAdd = prevProps[key] !== props[key];
				if (isEvent && toAdd) {
					// check that event is not undefined
					if (props[key]) {
						newEvents[toKonvaEvent(key)] = props[key];
					}
				}
			}

			for (const eventName in newEvents) {
				entity()?.on(eventName, newEvents[eventName]);
			}

			prevProps = { ...props };
		});

		onCleanup(() => {
			entity()?.destroy();
		});

		return <>{/* shape */}</>;
	}

	return Entity;
}
