const mongoose = require("mongoose");

const GrupoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  estatus: { type: String, default: "Activo" },
  comisionGrupo: { type: Number, default: 0 }
});

module.exports = mongoose.model("Grupo", GrupoSchema);