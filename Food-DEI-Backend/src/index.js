const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("RESTful Web Service para Food DEI");
});

app.listen(3000, function () {
  console.log("El servidor está corriendo en el puerto 3000");
});
