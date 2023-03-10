import express from "express";
import api from "./v1/api.js"
const app = express();

const port = 3002;
const host = "localhost";

// Include different API versions
app.use(api);

app.all("*", function(req, res) {
  // Redirect the user to the repository
  if (!(req.path).includes("/api/"))
    return res.status(302).redirect("https://github.com/cheekysim/speed-reader");
  // Return a 404 message
  res.status(404).json({ error: "Page not found" });
});

app.listen(port, () => console.log(`Server running at http://${host}:${port}`));