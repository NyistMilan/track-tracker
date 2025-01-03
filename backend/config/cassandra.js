const cassandra = require("cassandra-driver");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const sslOptions = {
  secureProtocol: "TLSv1_2_method",
  rejectUnauthorized: false,
};

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.CASSANDRA_USERNAME,
  process.env.CASSANDRA_PASSWORD
);

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINT],
  localDataCenter: process.env.CASSANDRA_LOCATION,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider,
  sslOptions,
  protocolOptions: { port: parseInt(process.env.CASSANDRA_PORT, 10) },
});

async function connect() {
  try {
    await client.connect();
    console.log("✅ Successfully connected to Azure Cosmos DB Cassandra API!");
  } catch (error) {
    console.error("❌ Failed to connect to Cosmos DB:");
    console.error(`Message: ${error.message}`);
    process.exit(1);
  }
}

connect();

module.exports = client;
