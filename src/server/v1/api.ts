import express, { Request, Response } from "express";
import { createCanvas } from "canvas";
import GIFEncoder from "gifencoder";
import { Readable } from "stream"

const router = express.Router();

router.post("/api/v1/create", async function(req: Request, res: Response) {
  // Create a canvas
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext("2d");
  const canvasArr: Buffer[] = [];

  // Define variables
  let theme = "dark";
  let fontSize: number = 100;

  if (!req.body.words)
    return res.status(400).json({ error: "Words must be provided" });
  if (["light", "dark"].includes(req.body.theme))
    theme = req.body.theme;
  if (["small", "medium", "large"].includes(req.body.font)) {
    switch (req.body.font) {
      case "small":
        fontSize = 50;
      case "large":
        fontSize = 150;
    }
  }

  // Temp code
  if (req.body.fontSize)
    fontSize = req.body.fontSize;
  
  for await (let word of req.body.words) {
    let fSize: number = fontSize;

    // Fill in the background colour
    ctx.fillStyle = theme === "light" ? "#ffffff" : "#000000";
    ctx.fillRect(0, 0, 400, 200);
    // Add the text
    ctx.font = `${fontSize}px Sans bold`;
    ctx.fillStyle = theme === "light" ? "#000000" : "#ffffff";

    // Reduce the font size if the word is too big for the canvas
    while (ctx.measureText(word).width > canvas.width) {
      fSize = fSize - 1;
      ctx.font = `${fSize}px Sans bold`;
    }

    let textWidth = ctx.measureText(word).width;
    ctx.fillText(word, (canvas.width / 2) - (textWidth / 2), (canvas.height / 2) + (fSize / 2));
    console.log("font size: " + fSize + "px");

    // Add the canvas to the array
    canvasArr.push(canvas.toBuffer());
  }

  // Create the GIF
  const encoder = new GIFEncoder(400, 200);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(100);
  for (let buffer of canvasArr) {
    encoder.addFrame(buffer);
  }
  encoder.finish();

  // Return the GIF as a stream
  const stream = new Readable();
  stream._read = () => {};
  encoder.on("data", function(data) {
    stream.push(data);
  });
  encoder.on("end", function() {
    stream.push(null);
  });

  res.status(200);
  stream.pipe(res);
});

export default router;