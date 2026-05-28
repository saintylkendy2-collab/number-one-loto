const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  id: { type: String },
  ticketId: { type: String },
  serial: { type: String },

  vendeur: { type: String },
  vendeurNom: { type: String },

  status: {
    type: String,
    default: "ANATAN"
  },

  premio: {
    type: Number,
    default: 0
  },

  total: Number,
  jeux: Array,
  tirages: [String],

  createdAt: Date,
  dateLabel: String,
  timeLabel: String,

  updatedAt: Date

}, {
  timestamps: true,
  id: false
});

TicketSchema.index({ dateLabel: 1, createdAt: -1 });
TicketSchema.index({ vendeur: 1, dateLabel: 1, createdAt: -1 });
TicketSchema.index({ status: 1, dateLabel: 1 });
TicketSchema.index({ id: 1 });
TicketSchema.index({ ticketId: 1 });
TicketSchema.index({ serial: 1 });

module.exports = mongoose.model("Ticket", TicketSchema);
