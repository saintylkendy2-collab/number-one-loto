const mongoose = require("mongoose");

mongoose.connect("METE_URL_MONGODB_OU_ISIT");

mongoose.connection.once("open", async () => {
  console.log("MongoDB konekte");

  const data = await mongoose.connection.db.collection("tickets").find().toArray();

  console.log("Tickets:", data);

  process.exit(); // fè li fèmen apre
});