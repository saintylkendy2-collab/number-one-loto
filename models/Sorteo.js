const mongoose = require("mongoose");

const SorteoSchema = new mongoose.Schema({
  date: { type: String, required: true },
  loteria: { type: String, required: true },

  r1: String,
  r2: String,
  r3: String,
  r4: String
}, {
  timestamps: true
});

SorteoSchema.index({ date: 1, loteria: 1 }, { unique: true });

module.exports = mongoose.model("Sorteo", SorteoSchema);