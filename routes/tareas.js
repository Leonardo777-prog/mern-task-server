// importamos express
const express = require("express");
// creamos el router
const router = express.Router();
// importamos el controlador
const tareaController = require("../controllers/tareaController");
// importampos express validator
const { check } = require("express-validator");
// importamos la autenticacion
const auth = require("../middleware/auth");

// crear una tarea
router.post(
  "/",
  auth,
  [
    check("nombre", "El Nombre es Obligatorio"),
    check("proyecto", "El Proyecto es Obligatorio"),
  ],
  tareaController.crearTarea
);

router.get("/", auth, tareaController.obtenerTareas);

// actualizar tarea
router.put("/:id", auth, tareaController.actualizarTarea);
// eliminar una tarea
router.delete("/:id", auth, tareaController.eliminarTarea);
module.exports = router;
