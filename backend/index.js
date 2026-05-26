const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Store Rating API is running." });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
