import express, { Request, Response } from "express";
import { createCanvas } from "canvas";
import GIFEncoder from "gifencoder";
import fs from "fs";

const router = express.Router();

router.get("/api/v1/create", function(req: Request, res: Response) {
  // Create a canvas
  const canvas = createCanvas(400, 200);
  const ctx = canvas.getContext("2d");

  // Define variables
  let theme = "dark";

  if (!req.body.words)
    return res.status(400).json({ error: "Words must be provided" });
  if (["light", "dark"].includes(req.body.theme))
    theme = req.body.theme;
  

  res.status(200).send("Hello, World!");
});

export default router;