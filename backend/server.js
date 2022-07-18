//require packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

const { Profile } = require("./modules/mongoose_models.js");

//require routes
const profileRoute = require("./routes/profileRoute.js")(passport);
const searchRoute = require("./routes/searchRoute.js");
const blogRoute = require("./routes/blogRouter.js")(passport);

//set up express
const app = express();

//set up some form reading middleware for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to mongoose database
mongoose.connect("mongodb://localhost:27017/profileBook", () => {
  console.log("Mongoose has connected to DB");
});

//set up sessions to handle cookies
const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

//this allows us to access messages from our LocalStrategy Middleware
app.use(flash());

//set up middleware for express to use passport
app.use(passport.initialize());
app.use(passport.session());

//tells passport how to set up the cookie and sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//instruct passport what to do when cracking open the cookie
passport.deserializeUser((id, done) => {
  Profile.findById(id, (err, user) => {
    done(err, user);
  });
});

//setting up how our local strategy interacts with out app
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      Profile.findOne({ email: username }, (err, user) => {
        if (err) return done(err);
        if (!user)
          return done(
            null,
            false,
            req.flash("message", "This Email Does not Exist")
          );

        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return done(err);
          if (result === false)
            return done(
              null,
              false,
              req.flash("message", "Incorrect Password")
            );

          return done(null, user);
        });
      });
    }
  )
);

app.use("/api/profile", profileRoute);
app.use("/api/search", searchRoute);
app.use("/api/blogs", blogRoute);

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
