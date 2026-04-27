const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://admin:1234@cluster0.yzqmfuc.mongodb.net/loto?retryWrites=true&w=majority");
    console.log("✅ MongoDB connecté");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  }
}

module.exports = connectDB;