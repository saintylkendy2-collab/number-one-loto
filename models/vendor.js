const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  id: String,
  clave: String,
  password: String,
  nom: String,
  nombre: String,
  telefono: String,
  direccion: String,
  estatus: String,
  zona: String,
  groupe: String,
  app: String,
  conexion: String,
  conexiones: Array,
  movimientos: Array,
  config: Object,
  comision: Object,
  premios: Object,
  limites: Object,
  venta: Number,
  premiosMonto: Number,
  balance: Number
}, {
  strict: false,
  timestamps: true
});


module.exports = mongoose.model("Vendor", VendorSchema);