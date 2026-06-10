import { Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Circle, Layer, Rect, Stage } from "../lib";

export function ShapeDemo() {
	const [state, setState] = createStore({
		x1: 50,
		show: true,
		show2: true,
		circlePos: { x: 200, y: 200 },
		rectPos: { x: 100, y: 100 },
	});

	return (
		<>
			<div>
				<button type="button" onClick={() => setState("show", (v) => !v)}>
					<Show when={state.show} fallback={<>show</>}>
						hide
					</Show>{" "}
					the Circle with visible prop
				</button>
				<button type="button" onClick={() => setState("show2", (v) => !v)}>
					<Show when={state.show2} fallback={<>show</>}>
						hide
					</Show>{" "}
					the Rectangle with {"<Show />"}
				</button>
			</div>
			<input
				type="range"
				min={0}
				max={1000}
				value={state.x1}
				onInput={(e) => setState("x1", e.currentTarget.valueAsNumber)}
			/>
			<input
				type="range"
				min={0}
				max={1000}
				value={state.rectPos.x}
				onInput={(e) => setState("rectPos", "x", e.currentTarget.valueAsNumber)}
			/>
			<input
				type="range"
				min={0}
				max={1000}
				value={state.rectPos.y}
				onInput={(e) => setState("rectPos", "y", e.currentTarget.valueAsNumber)}
			/>
			<div>
				{state.circlePos.x} - {state.circlePos.y}
			</div>
			<Stage style={{ height: "calc(100vh - 8rem)" }}>
				<Layer>
					<Show when={state.show}>
						<Circle
							{...{
								x: state.circlePos.x,
								y: state.circlePos.y,
								width: 100,
								height: 50,
								fill: "red",
								stroke: "black",
								strokeWidth: 4,
								draggable: true,
							}}
							onDragMove={(e) => setState("circlePos", e.target.getPosition())}
						/>
					</Show>
					<Circle
						{...{
							x: state.x1,
							y: 50,
							width: 100,
							height: 50,
							fill: "red",
							stroke: "black",
							strokeWidth: 4,
						}}
					/>
					<Show when={state.show2}>
						<Rect
							{...{
								x: state.rectPos.x,
								y: state.rectPos.y,
								width: 100,
								height: 50,
								fill: "red",
								stroke: "black",
								strokeWidth: 4,
								draggable: true,
							}}
							onDragMove={(e) => setState("rectPos", e.target.getPosition())}
						/>
					</Show>
				</Layer>
			</Stage>
		</>
	);
}
