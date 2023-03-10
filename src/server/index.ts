import express, { Request, Response } from "express";
import api from "./v1/api.js"
import config from "./config.json" assert { type: "json" };
const app = express();

// Include different API versions
app.use(api);

// Handle 404 requests
app.all("*", function(req: Request, res: Response) {
  // Redirect the user to the repository
  if (!(req.path).includes("/api/"))
    return res.status(302).redirect("https://github.com/cheekysim/speed-reader");
  // Return a 404 message
  res.status(404).json({ error: "Page not found" });
});

app.listen(config.port, () => console.log(`Server running at http://${config.host}:${config.port}`));