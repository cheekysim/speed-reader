const express = require("express");
const app = express();
const { supportedVersions } = require("./config.json");

// Include different API versions
app.use(require("./v1/api"));

app.all("*", function(req, res) {
  // Redirect the user to the repository
  if (!(req.path).includes("/api/"))
    return res.status(302).redirect("https://github.com/cheekysim/speed-reader");
  // Return a 404 message
  res.status(404).json({ error: "Page not found" });
});

app.listen(3002, () => console.log("Server is online"));