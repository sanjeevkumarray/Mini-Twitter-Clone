const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./assets"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "twitterClones",
    secret: "sanjeev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://127.0.0.1/twitterClone",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || `connect-mongodb setup ok!`);
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.on("error", (err) => {
  console.log(`Error in running the server: ${err}`);
});
