import type { Component } from "solid-js";
import { FreeDrawingDemo } from "./FreeDrawingDemo";
import { ShapeDemo } from "./ShapeDemo";
import "./app.css";

const App: Component = () => {
	return (
		<div class="app">
			<div class="app__pane">
				<ShapeDemo />
			</div>
			<div class="app__pane">
				<FreeDrawingDemo />
			</div>
		</div>
	);
};

export default App;
