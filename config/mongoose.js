const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/twitterClone", { useNewUrlParser: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "erroe connecting to db"));

db.once("open", function () {
  console.log("successfully Connected to Database:: MongoDB");
});
