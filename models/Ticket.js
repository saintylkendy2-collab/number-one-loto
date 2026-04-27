const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

TicketSchema.index({ id: 1 }, { unique: true });
TicketSchema.index({ vendeur: 1 });
TicketSchema.index({ sellerId: 1 });

module.exports = mongoose.model("Ticket", TicketSchema);