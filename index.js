require("dotenv").config();
const express = require("express");
const notFound = require("./middleware/notFound");
const mongooseConnection = require("./config/database");
const cookieParser = require('cookie-parser');
const path = require("path");
const app = express();

mongooseConnection();

// Setup View Engine
app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Defining the cookieParser to be used
app.use(cookieParser());

// setup static file
app.use(express.static(path.join(__dirname, "/public")));

// authentication
// app.use(authentication);

// router
app.use("/api", require("./routes/root"));

//webhook url
app.post('/webhook', (req,res) => {console.log(req.body); res.json(req.body)})
app.use(notFound);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`sever running on http://localhost:${PORT}`)
);
