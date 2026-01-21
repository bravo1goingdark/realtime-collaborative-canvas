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

        if (points.length < 3) {
            this.ctx.lineTo(points[1].x, points[1].y);
            this.ctx.stroke();
            return;
        }

        for (let i = 1; i < points.length - 2; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        this.ctx.quadraticCurveTo(
            points[points.length - 2].x,
            points[points.length - 2].y,
            points[points.length - 1].x,
            points[points.length - 1].y
        );

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
