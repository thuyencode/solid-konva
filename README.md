# solid-konva

[![npm version](https://img.shields.io/npm/v/solid-konva)](https://www.npmjs.com/package/solid-konva)
[![License](https://img.shields.io/npm/l/solid-konva)](https://github.com/lawrencecchen/solid-konva/blob/main/LICENSE)

**Solid.js bindings for [Konva.js](https://konvajs.org/)** — declarative 2D canvas rendering with reactive primitives.

Write HTML5 Canvas applications using Solid components. No imperative Konva API calls needed.

```tsx
import { Circle, Layer, Rect, Stage } from "solid-konva";

function App() {
  return (
    <Stage style={{ height: "100vh" }}>
      <Layer>
        <Circle x={100} y={100} width={100} height={50} fill="red" />
        <Rect x={200} y={100} width={100} height={50} fill="blue" draggable />
      </Layer>
    </Stage>
  );
}
```

## Install

```bash
npm install solid-konva konva solid-js
```

`solid-konva` lists `konva` and `solid-js` as peer dependencies — you must install them yourself.

## Usage

### Components

`solid-konva` mirrors the Konva node hierarchy: `Stage` → `Layer` → `Shape`.

#### `<Stage>`

The root container. Renders a `<div>` that hosts the Konva stage. Automatically resizes to fill its container using a `ResizeObserver`.

```tsx
import { Stage } from "solid-konva";

<Stage style={{ height: "500px" }}>
  {/* layers go here */}
</Stage>
```

Props: all `StageConfig` properties from Konva (except `container`, which is managed internally), plus any HTML div attributes for the wrapper element.

#### `<Layer>`

A drawing layer. Must be a child of `<Stage>`. Provides a context for all shape children.

```tsx
import { Layer } from "solid-konva";

<Layer>
  {/* shapes go here */}
</Layer>
```

Props: all `LayerConfig` properties from Konva.

#### Shapes

All Konva shapes are available as components. They must be children of a `<Layer>`.

| Component         | Konva class       |
|-------------------|-------------------|
| `<Rect />`        | `Konva.Rect`      |
| `<Circle />`      | `Konva.Circle`    |
| `<Ellipse />`     | `Konva.Ellipse`   |
| `<Line />`        | `Konva.Line`      |
| `<Text />`        | `Konva.Text`      |
| `<TextPath />`    | `Konva.TextPath`  |
| `<Image />`       | `Konva.Image`     |
| `<Sprite />`      | `Konva.Sprite`    |
| `<Star />`        | `Konva.Star`      |
| `<Ring />`        | `Konva.Ring`      |
| `<Arc />`         | `Konva.Arc`       |
| `<Wedge />`       | `Konva.Wedge`     |
| `<Path />`        | `Konva.Path`      |
| `<Arrow />`       | `Konva.Arrow`     |
| `<Tag />`         | `Konva.Tag`       |
| `<RegularPolygon />` | `Konva.RegularPolygon` |
| `<Group />`       | `Konva.Group`     |
| `<Shape />`       | `Konva.Shape`     |
| `<Transformer />` | `Konva.Transformer` |

Each shape accepts its corresponding `ShapeConfig` props from Konva, plus event handlers (see below).

```tsx
import { Circle, Rect, Star } from "solid-konva";

<Circle x={100} y={100} radius={50} fill="red" />
<Rect x={200} y={100} width={100} height={50} fill="blue" draggable />
<Star x={350} y={100} numPoints={5} innerRadius={20} outerRadius={50} fill="gold" />
```

### Reactivity

Props are reactive — update a signal and the shape re-renders automatically.

```tsx
const [x, setX] = createSignal(50);

<Circle x={x()} y={100} radius={50} fill="red" />
<input type="range" value={x()} onInput={(e) => setX(+e.currentTarget.value)} />
```

### Conditional rendering

Use Solid's `<Show>` control flow to mount/unmount shapes:

```tsx
<Show when={isVisible()}>
  <Circle x={100} y={100} radius={50} fill="red" />
</Show>
```

### Events

Attach Konva events with `on` + event name (camelCase or lowercase). Both forms work:

```tsx
<Circle
  onClick={(e) => console.log("clicked", e)}
  onDragMove={(e) => console.log("dragging", e.target.position())}
  onmouseover={(e) => console.log("mouse over")}
  draggable
/>
```

Supported events: `MouseOver`, `MouseOut`, `MouseEnter`, `MouseLeave`, `MouseMove`, `MouseDown`, `MouseUp`, `Wheel`, `Click`, `DblClick`, `TouchStart`, `TouchMove`, `TouchEnd`, `Tap`, `DblTap`, `PointerDown`, `PointerMove`, `PointerUp`, `PointerCancel`, `PointerOver`, `PointerEnter`, `PointerOut`, `PointerLeave`, `PointerClick`, `PointerDblClick`, `DragStart`, `DragMove`, `DragEnd`.

Transformer-specific events: `TransformStart`, `Transform`, `TransformEnd`.

All events also accept lowercase variants (e.g. `onclick`, `ondragmove`).

### Accessing the Stage

Use the `useStage` hook to access the underlying Konva.Stage instance from any descendant component:

```tsx
import { useStage } from "solid-konva";

function DrawingCanvas() {
  const stage = useStage();

  createEffect(() => {
    const s = stage?.stage();
    if (!s) return;
    const pos = s.getPointerPosition();
    // ...
  });

  return <Line points={...} />;
}
```

## Examples

- [StackBlitz playground](https://stackblitz.com/edit/vitejs-vite-ey9bl2?file=src%2FApp.tsx) — interactive demo with sliders and draggable shapes.
- [`src/FreeDrawingDemo.tsx`](./src/FreeDrawingDemo.tsx) — freehand drawing with brush/eraser tools.
- [`src/ShapeDemo.tsx`](./src/ShapeDemo.tsx) — reactive shapes with conditional rendering and drag events.

## API

### Exports

| Export | Kind | Description |
|--------|------|-------------|
| `Stage` | Component | Root Konva stage container |
| `Layer` | Component | Drawing layer (child of Stage) |
| `useStage` | Hook | Access the Konva.Stage instance from context |
| `useLayer` | Hook | Access the Konva.Layer instance from context |
| `Group`, `Rect`, `Circle`, `Ellipse`, `Wedge`, `Line`, `Sprite`, `Image`, `Text`, `TextPath`, `Star`, `Ring`, `Arc`, `Tag`, `Path`, `RegularPolygon`, `Arrow`, `Shape`, `Transformer` | Components | Konva shape components |

### TypeScript

The library ships with full TypeScript declarations. Shape components accept their corresponding Konva config types plus event handler props.

```ts
import type { KonvaEvents, TransformerEvents } from "solid-konva";
```

## How it works

Each shape component is created via `createEntity()`, which:

1. Instantiates the corresponding `Konva.Node` on mount.
2. Adds it to the parent layer (provided via Solid context).
3. Watches props reactively and calls `setAttrs()` on changes.
4. Manages event binding/unbinding when event handlers change.
5. Destroys the node on cleanup.

The `Stage` component uses `@solid-primitives/resize-observer` to automatically track container size and update the stage dimensions.

## License

MIT
