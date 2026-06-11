import type Konva from "konva";
import { createEffect, createSignal, For, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { Layer, Line, Stage, useStage } from "../lib";

function DrawingCanvas(props: { tool: () => string }) {
	const stage = useStage();
	const [lines, setLines] = createStore<{ tool: string; points: number[] }[]>(
		[],
	);
	let isDrawing = false;

	createEffect(() => {
		const s = stage?.stage();
		if (!s) return;

		const handleMouseDown = () => {
			isDrawing = true;
			const pos = s.getPointerPosition();
			if (!pos) return;
			setLines([
				...lines,
				{ tool: props.tool(), points: [pos.x, pos.y, pos.x, pos.y] },
			]);
		};

		const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
			if (!isDrawing) return;
			e.evt.preventDefault();
			const pos = s.getPointerPosition();
			if (!pos) return;
			const idx = lines.length - 1;
			if (idx < 0) return;
			const prev = lines[idx].points;
			setLines(idx, "points", [...prev, pos.x, pos.y]);
		};

		const handleMouseUp = () => {
			isDrawing = false;
		};

		s.on("mousedown touchstart", handleMouseDown);
		s.on("mousemove touchmove", handleMouseMove);
		s.on("mouseup touchend", handleMouseUp);

		onCleanup(() => {
			s.off("mousedown touchstart", handleMouseDown);
			s.off("mousemove touchmove", handleMouseMove);
			s.off("mouseup touchend", handleMouseUp);
		});
	});

	return (
		<For each={lines}>
			{(line) => (
				<Line
					points={line.points}
					stroke="#df4b26"
					strokeWidth={5}
					tension={0.5}
					lineCap="round"
					lineJoin="round"
					globalCompositeOperation={
						line.tool === "eraser" ? "destination-out" : "source-over"
					}
				/>
			)}
		</For>
	);
}

export function FreeDrawingDemo() {
	const [tool, setTool] = createSignal("brush");

	return (
		<>
			<select value={tool()} onChange={(e) => setTool(e.currentTarget.value)}>
				<option value="brush">Brush</option>
				<option value="eraser">Eraser</option>
			</select>
			<Stage style={{ height: "calc(100vh - 2rem)" }}>
				<Layer>
					<DrawingCanvas tool={tool} />
				</Layer>
			</Stage>
		</>
	);
}
