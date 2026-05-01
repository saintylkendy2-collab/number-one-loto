const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  id: String,
  clave: String,
  nombre: String,
  telefono: String,
  direccion: String,
  estatus: String
});

module.exports = mongoose.model("Vendor", VendorSchema);