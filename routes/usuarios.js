// rutas para crear user
const express = require("express");
// usamos el ruter
const router = express.Router();
// controlador de usuarios
const usuariosController = require("../controllers/usuariosController");
// validator de express
const { check } = require("express-validator");

// crea un usuario con el metodo de un controlador
router.post(
  "/",
  [
    check("nombre", "El nombre es Obligatorio").not().isEmpty(),
    check("email", "El Email es Obligatorio").isEmail(),
    check("password", "La contraseña debe ser de 6 caracteres").isLength({ min: 6 }),
  ],
  usuariosController.crearUsuario
);
// exportamos el router
module.exports = router;
