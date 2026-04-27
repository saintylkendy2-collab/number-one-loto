const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:1234@cluster0.yzqmfuc.mongodb.net/loto?retryWrites=true&w=majority");

mongoose.connection.once("open", async () => {
  console.log("MongoDB konekte");

  const data = await mongoose.connection.db.collection("tickets").find().toArray();

  console.log("Tickets:", data);

  process.exit(); // fè li fèmen apre
});