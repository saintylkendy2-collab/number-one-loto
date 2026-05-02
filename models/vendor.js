const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({}, {
  strict: false,
  timestamps: true
});

module.exports = mongoose.model("Vendor", VendorSchema);