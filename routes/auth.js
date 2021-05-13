// rutas para autenticar usuarios
const express = require("express");
// usamos el ruter
const router = express.Router();
// validator de express
const { check } = require("express-validator");
// pasamos el controller
const authController = require("../controllers/authController");
// crea un usuario con el metodo de un controlador
const auth = require("../middleware/auth");
router.post(
  "/",
  [
    check("email", "El Email es Obligatorio").isEmail(),
    check("password", "La contraseña debe ser de 6 caracteres").isLength({
      min: 6,
    }),
  ],
  authController.autenticarUsuario
);
router.get("/", auth, authController.usuarioAutenticado);
// exportamos el router
module.exports = router;
