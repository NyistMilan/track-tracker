const mongoose = require("mongoose");

const connectionOptions = {
  retryWrites: false,
  tls: true,
  authMechanism: "SCRAM-SHA-256",
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("✅ Successfully connected to Azure Cosmos DB MongoDB API!");
});

module.exports = mongoose;
