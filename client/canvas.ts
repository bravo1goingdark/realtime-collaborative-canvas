import { Operation, StrokeData, EraseData } from "../server/types.js";

export class CanvasRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }

        this.canvas = canvas;
        this.ctx = ctx;
    }


    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    replay(operations: Operation[]): void {
        this.clear();
        for (const op of operations) {
            this.renderOperation(op);
        }
    }

    renderOperation(op: Operation): void {
        switch (op.type) {
            case "stroke":
                this.drawStroke(op.data as StrokeData);
                break;

            case "erase":
                this.erase(op.data as EraseData);
                break;
        }
    }


    private drawStroke(data: StrokeData): void {
        const { points, color, width } = data;
        if (points.length < 2) return;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (const p of points.slice(1)) {
            this.ctx.lineTo(p.x, p.y);
        }

        this.ctx.stroke();
    }

    private erase(data: EraseData): void {
        const { points, width } = data;
        if (points.length < 1) return;

        this.ctx.save();
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.lineWidth = width;
        this.ctx.lineCap = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);

        for (const p of points.slice(1)) {
            this.ctx.lineTo(p.x, p.y);
        }

        this.ctx.stroke();
        this.ctx.restore();
    }
}
