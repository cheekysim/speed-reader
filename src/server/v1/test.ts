import { createCanvas, CanvasRenderingContext2D } from "canvas";

const canvasArr: CanvasRenderingContext2D[] = [];

for (let i = 0; i < 10; i++) {
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext("2d");

  // Do something with the canvas and context
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, 0, 400, 200);
  ctx.fillStyle = "#000000";
  ctx.fillText(`Canvas ${i}`, 200, 100);

  // Push the context to the array
  canvasArr.push(ctx);
}