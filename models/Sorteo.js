const mongoose = require("mongoose");

const SorteoSchema = new mongoose.Schema({
  date: { type: String, required: true },
  loteria: { type: String, required: true },
  r1: String,
  r2: String
}, {
  timestamps: true
});

// Evite doublon (menm tirage 2 fwa)
SorteoSchema.index({ date: 1, loteria: 1 }, { unique: true });

module.exports = mongoose.model("Sorteo", SorteoSchema);