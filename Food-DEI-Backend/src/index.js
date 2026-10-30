import express from "express";
import cors from "cors";

const app = express();

// Importar rutas
import menuRoutes from "./routes/menuRoutes.js";

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware para poner las rutas
app.use("/api", menuRoutes);

app.get("/", function (req, res) {
  res.send("RESTful Web Service para Food DEI");
});

app.listen(3000, function () {
  console.log("El servidor está corriendo en el puerto 3000");
});
