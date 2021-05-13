// importamos express
const express = require("express");
// creamos el router
const router = express.Router();
// importamos el controlador
const proyectoController = require("../controllers/proyectoController");
// importampos express validator
const { check } = require("express-validator");
// importamos la autenticacion
const auth = require("../middleware/auth");

router.post(
  "/",
  auth,
  [check("nombre", "El nombre es Obligatorio").not().isEmpty()],
  proyectoController.crearProyectos
);

router.get("/", auth, proyectoController.obtenerProyectos);

// actualizar proyecto
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre es Obligatorio").not().isEmpty()],
  proyectoController.actualizarProyecto
);

// eliminar un proyecto
router.delete("/:id", auth, proyectoController.eliminarProyecto);
module.exports = router;
