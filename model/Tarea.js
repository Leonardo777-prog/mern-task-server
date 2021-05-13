const mongoose = require("mongoose");

const TareaShema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: Boolean,
    default: false,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
  proyecto: {
    //  tipo referencia
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
  },
});

module.exports = mongoose.model("Tarea", TareaShema);
