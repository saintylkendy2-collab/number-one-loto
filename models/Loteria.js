const mongoose = require("mongoose");

const LoteriaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  abrev: { type: String, default: "" },
  estatus: { type: String, default: "Activo" },

  openTime: { type: String, default: "00:00" },
  closeTime: { type: String, default: "23:59" },

  limite: { type: Boolean, default: false },
  pago: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Loteria", LoteriaSchema);