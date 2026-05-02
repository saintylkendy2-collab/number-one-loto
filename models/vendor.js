const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({}, {
  strict: false,
  timestamps: true
});

VendorSchema.index({ id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Vendor", VendorSchema);