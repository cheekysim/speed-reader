import express, { Request, Response } from "express";
import { createCanvas, CanvasRenderingContext2D } from "canvas";
import GIFEncoder from "gifencoder";

const router = express.Router();

router.post("/api/v1/create", async function (req: Request, res: Response) {
  /*
    This is the main API endpoint. It takes in a JSON object with the following properties:
    - words: The words to be displayed on the GIF
    - theme: The theme of the GIF (light or dark)
    - font: The font size of the GIF (small, medium or large)
    - wpm: The words per minute of the GIF (default is 300)
    
    It returns a GIF with the words displayed on it.
  */

  // Create an array of canvases
  const canvasArr: CanvasRenderingContext2D[] = [];

  // Define variables
  let theme = "dark";
  let fontSize: number = 100;

  if (!req.body.words)
    return res.status(400).json({ error: "Words must be provided" });
  if (["light", "dark"].includes(req.body.theme)) theme = req.body.theme;
  if (["small", "medium", "large"].includes(req.body.font)) {
    switch (req.body.font) {
      case "small":
        fontSize = 50;
      case "large":
        fontSize = 150;
    }
  }
  
  for await (let word of req.body.words.split(' ')) {
    // Create a canvas
    let canvas = createCanvas(400, 200);
    let ctx = canvas.getContext("2d");
    let fSize: number = fontSize;

    // Fill in the background colour
    ctx.fillStyle = theme === "light" ? "#ffffff" : "#000000";
    ctx.fillRect(0, 0, 400, 200);

    // Add the text
    ctx.font = `${fontSize}px Sans`;
    ctx.fillStyle = theme === "light" ? "#000000" : "#ffffff";

    // Reduce the font size if the word is too big for the canvas
    while (ctx.measureText(word).width > canvas.width) {
      fSize = fSize - 1;
      ctx.font = `${fSize}px Sans`;
    }

    let textWidth = ctx.measureText(word).width;
    ctx.fillText(
      word,
      canvas.width / 2 - textWidth / 2,
      canvas.height / 2 + fSize / 2
    );

    // Add the canvas to the array
    canvasArr.push(ctx);
  }

  // Create the GIF
  res.setHeader("Content-Type", "image/gif");
  const encoder = new GIFEncoder(400, 200);
  encoder.createReadStream().pipe(res);

  encoder.start();
  encoder.setRepeat(-1);
  
  // Calculate delay from words per minute or default to 200 ( 300 wpm )
  let delay = (1000 / (req.body.wpm / 60)) || 200;

  encoder.setDelay(delay);
  for (let context of canvasArr) {
    encoder.addFrame(context);
  }
  encoder.finish();
});

export default router;