const Usuario = require("../model/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  // extraer email y pass
  const { email, password } = req.body;
  try {
    //   revisar que el usuario sa unico

    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    //   guardar usuario
    usuario = new Usuario(req.body);

    // hashear el pass
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);
    await usuario.save();

    // crear el jwt
    const payload = {
      usuario: usuario.id,
    };

    // firmar el jwt
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        res.json({ token });
      }
    );
    // mensaje de confirmacion
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
