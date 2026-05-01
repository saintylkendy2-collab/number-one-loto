const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  id: { type: String },
  ticketId: { type: String },
  serial: { type: String }
}, {
  strict: false,
  timestamps: true,
  id: false
});

TicketSchema.index({ id: 1 }, { unique: true, sparse: true });
TicketSchema.index({ ticketId: 1 }, { sparse: true });
TicketSchema.index({ serial: 1 }, { sparse: true });
TicketSchema.index({ vendeur: 1 });
TicketSchema.index({ sellerId: 1 });

module.exports = mongoose.model("Ticket", TicketSchema);