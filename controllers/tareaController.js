const Tarea = require("../model/Tarea");
const Proyecto = require("../model/Proyecto");
const { validationResult } = require("express-validator");
// creamos una tarea
exports.crearTarea = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // extraeer el proyecto y comporvar si exsite
  try {
    const { proyecto } = req.body;
    const proyectoExiste = await Proyecto.findById(proyecto);
    if (!proyectoExiste) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    if (proyectoExiste.creador.toString() !== req.usuario) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // creamos la tarea
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json({ tarea });
    // revisar si el proyecto actual es del usuario auteinticado
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
// Obtener las tareas de cada proyecto
exports.obtenerTareas = async (req, res) => {
  try {
    const { proyecto } = req.query;
    const proyectoExiste = await Proyecto.findById(proyecto);
    if (!proyectoExiste) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    if (proyectoExiste.creador.toString() !== req.usuario) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    // obtener poyectos
    const tareas = await Tarea.find({ proyecto: proyecto }).sort({
      creado: -1,
    });
    console.log(tareas);
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
// actualizar una tarea
exports.actualizarTarea = async (req, res) => {
  try {
    const { proyecto, nombre, estado } = req.body;

    let tareaExiste = await Tarea.findById(req.params.id);

    if (!tareaExiste) {
      return res.status(404).json({ msg: "No no existe" });
    }
    const proyectoExiste = await Proyecto.findById(proyecto);
    if (proyectoExiste.creador.toString() !== req.usuario) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    const nuevaTarea = {};

    nuevaTarea.nombre = nombre;

    nuevaTarea.estado = estado;

    tareaExiste = await Tarea.findOneAndUpdate(
      { _id: req.params.id },
      nuevaTarea,
      { new: true }
    );

    res.json({ tareaExiste });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

// eliminar una tarea
exports.eliminarTarea = async (req, res) => {
  try {
    const { proyecto } = req.query;

    let tareaExiste = await Tarea.findById(req.params.id);

    if (!tareaExiste) {
      return res.status(404).json({ msg: "No no existe" });
    }
    const proyectoExiste = await Proyecto.findById(proyecto);
    if (proyectoExiste.creador.toString() !== req.usuario) {
      return res.status(401).json({ msg: "No autorizado" });
    }
    await Tarea.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
