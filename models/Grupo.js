const GrupoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  estatus: { type: String, default: "Activo" },
  comisionGrupo: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Grupo", GrupoSchema);