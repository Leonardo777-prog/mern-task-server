const Proyecto = require("../model/Proyecto");
const { validationResult } = require("express-validator");

exports.crearProyectos = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //   crear un nuevo proyecto
    const proyecto = new Proyecto(req.body);
    console.log(req);
    proyecto.creador = req.usuario;
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// obtiene todos los proyectos del user
exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario }).sort({
      creado: -1,
    });
    res.json(proyectos);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // extarer la informacion del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};
  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }
  try {
    // revisar el id
    let proyecto = await Proyecto.findById(req.params.id);
    // si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "El proyecto no existe" });
    }
    // verificar el credor del proyecto
    if (proyecto.creador.toString() !== req.usuario) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );
    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
// eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    let proyecto = await Proyecto.findById(req.params.id);
    // si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "El proyecto no existe" });
    }
    // verificar el credor del proyecto
    if (proyecto.creador.toString() !== req.usuario) {
      res.status(401).json({ msg: "No autorizado" });
    }

    // eliminar el proyecto
    await Proyecto.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
