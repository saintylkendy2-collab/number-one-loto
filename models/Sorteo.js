const mongoose = require("mongoose");

const SorteoSchema = new mongoose.Schema({
  date: String,
  loteria: String,
  r1: String,
  r2: String,
  r3: String,
  r4: String
}, {
  timestamps: true
});

module.exports = mongoose.model("Sorteo", SorteoSchema);