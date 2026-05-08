const mongoose = require("mongoose");

const GrupoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  estatus: { type: String, default: "Activo" }
}, { timestamps: true });

module.exports = mongoose.model("Grupo", GrupoSchema);