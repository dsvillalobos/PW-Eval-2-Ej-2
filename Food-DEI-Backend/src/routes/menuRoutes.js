import express from "express";
const router = express.Router();
import * as menuController from "../controllers/menuController.js";

router.get("/menu", menuController.showMenu);
router.get("/reserva", menuController.showReservas);
router.post("/reserva/agregar", menuController.agregarReserva);
router.put(
  "/reserva/actualizar-porciones/:id",
  menuController.actualizarPorciones,
);
router.delete("/reserva/eliminar/:id", menuController.eliminarPlato);

export default router;
