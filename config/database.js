const mongo = require("mongoose");
const mongooseConnection = () => {
  mongo.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongo.connection;
  db.on("error", (error) => {
    console.log(error);
  });
  db.on("connected", () => {
    console.log("Connected to MongoDB");
  });
};

module.exports = mongooseConnection;