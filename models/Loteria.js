const mongoose = require("mongoose");

const LoteriaSchema = new mongoose.Schema({

  name: { type: String, required: true, unique: true },

  abrev: { type: String, default: "" },

  estatus: { type: String, default: "Activo" },

  openTime: { type: String, default: "00:00" },

  closeTime: { type: String, default: "23:59" },

  closeDays: {

    monday:    { type: String, default: "23:59" },
    tuesday:   { type: String, default: "23:59" },
    wednesday: { type: String, default: "23:59" },
    thursday:  { type: String, default: "23:59" },
    friday:    { type: String, default: "23:59" },
    saturday:  { type: String, default: "23:59" },
    sunday:    { type: String, default: "23:59" }

  },

  limite: { type: Boolean, default: false },

  pago: { type: Boolean, default: true }

}, { timestamps: true });

module.exports = mongoose.model("Loteria", LoteriaSchema);