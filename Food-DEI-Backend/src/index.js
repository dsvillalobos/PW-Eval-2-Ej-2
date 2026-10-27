const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", function (req, res) {
  res.send("RESTful Web Service para Food DEI");
});

app.listen(3000, function () {
  console.log("El servidor está corriendo en el puerto 3000");
});
