const Usuario = require("../model/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //   extraer el email y el pass
  const { email, password } = req.body;

  try {
    //   revisra que sea un user register
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const passCorrecto = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecto) {
      return res.status(400).json({ msg: "Password Incorrecto" });
    }
    // si todo es correcto creamos jwt

    // crear el jwt
    const payload = { usuario: usuario.id };
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
  } catch (error) {
    console.log(error);
  }
};

// obtiene que user esta autenticado
exports.usuarioAutenticado = async (req, res) => {
  try {
    console.log(req.usuario);
    const usuario = await Usuario.findById(req.usuario).select("-password");
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};
