import express, { Request, Response } from "express";
const router = express.Router();

router.get("/api/v1/", function(req: Request, res: Response) {
  res.status(200).send("Hello, World!");
});

export default router;