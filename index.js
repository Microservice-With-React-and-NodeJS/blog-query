const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

//we need 2 rout handlers. one for event-bus events, one for getting post
app.get("/posts", (req, res) => {});

app.post("/posts", (req, res) => {});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
