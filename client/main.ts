import { CanvasRenderer } from "./canvas";
import { CanvasSocket } from "./websocket";
import { Operation } from "../server/types";


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) throw new Error("Canvas element not found");

const colorPicker = document.getElementById("color-picker") as HTMLInputElement;
if (!colorPicker) throw new Error("Color picker element not found");

let currentColor = colorPicker.value;
colorPicker.addEventListener("input", () => {
    currentColor = colorPicker.value;
});


const renderer = new CanvasRenderer(canvas);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


const socket = new CanvasSocket(
    "ws://localhost:8080",
    "room1",
    {
        onInit: (ops) => renderer.replay(ops),
        onUpdate: (op) => renderer.renderOperation(op),
        onSync: (ops) => renderer.replay(ops),
    }
);


type Tool = "stroke" | "erase";
let currentTool: Tool = "stroke";

const userId = "user-" + Math.random().toString(36).slice(2, 6);


let drawing = false;
let currentPoints: { x: number; y: number }[] = [];


canvas.addEventListener("pointerdown", (e) => {
    drawing = true;
    currentPoints = [{ x: e.offsetX, y: e.offsetY }];
});

canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;

    const point = { x: e.offsetX, y: e.offsetY };

    if (currentTool === "stroke" || currentTool === "erase") {
        currentPoints.push(point);

        renderer.renderOperation({
            id: "local",
            type: currentTool,
            userId: "local",
            timestamp: Date.now(),
            data:
                currentTool === "stroke"
                    ? {
                        points: currentPoints.slice(-2),
                        color: currentColor,
                        width: 2,
                    }
                    : {
                        points: currentPoints.slice(-2),
                        width: 20,
                    },
        } as Operation);
    }
});


canvas.addEventListener("pointerup", (e) => {
    if (!drawing) return;
    drawing = false;

    if (currentTool === "stroke" && currentPoints.length >= 2) {
        socket.sendOperation({
            type: "stroke",
            userId,
            timestamp: Date.now(),
            data: {
                points: currentPoints,
                color: currentColor,
                width: 2,
            },
        });
    }

    if (currentTool === "erase" && currentPoints.length >= 1) {
        socket.sendOperation({
            type: "erase",
            userId,
            timestamp: Date.now(),
            data: {
                points: currentPoints,
                width: 20,
            },
        });
    }

    currentPoints = [];
});

const toolStrokeBtn = document.getElementById("tool-stroke") as HTMLButtonElement;
const toolEraseBtn = document.getElementById("tool-erase") as HTMLButtonElement;
const fpsDisplay = document.getElementById("fps-display") as HTMLDivElement;

if (!toolStrokeBtn || !toolEraseBtn || !fpsDisplay) {
    throw new Error("One or more UI elements not found for tool selection or FPS display.");
}

function setActiveToolButton(tool: Tool) {
    toolStrokeBtn.classList.remove("active-tool");
    toolEraseBtn.classList.remove("active-tool");
    if (tool === "stroke") {
        toolStrokeBtn.classList.add("active-tool");
    } else {
        toolEraseBtn.classList.add("active-tool");
    }
}

toolStrokeBtn.addEventListener("click", () => {
    currentTool = "stroke";
    setActiveToolButton("stroke");
});

toolEraseBtn.addEventListener("click", () => {
    currentTool = "erase";
    setActiveToolButton("erase");
});

setActiveToolButton(currentTool);


(document.getElementById("undo") as HTMLButtonElement)
    .addEventListener("click", () => socket.undo());

(document.getElementById("redo") as HTMLButtonElement)
    .addEventListener("click", () => socket.redo());


window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") socket.undo();
    if (e.ctrlKey && e.key === "y") socket.redo();
});

let frameCount = 0;
let lastTime = performance.now();

function updateFps() {
    frameCount++;
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastTime;

    if (elapsedTime >= 1000) { // Update FPS every second
        const fps = Math.round((frameCount / elapsedTime) * 1000);
        fpsDisplay.textContent = `FPS: ${fps}`;
        frameCount = 0;
        lastTime = currentTime;
    }

    requestAnimationFrame(updateFps);
}

updateFps();

