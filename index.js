// exportamos express
const express = require("express");
// exportamos la config de la base de datos
const conectarDB = require("./config/db");
// impoortamos cors
const cors = require("cors");
// creamos el server
const app = express();
// conetamos la base de datos
conectarDB();

// abilitar cons
app.use(cors())
// habilitar express.json
app.use(express.json({ extended: true }));

// puerto de la app
const PORT = process.env.PORT || 4000;
// requerimos el archivo de ruta de usuarios
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

app.listen(PORT, () => {
  console.log(`El server esta corriendo ${PORT}`);
});
