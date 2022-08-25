const { ReadStream, appendFile } = require("fs");

module.exports = function (passport) {
  const express = require("express");
  const fileUploader = require("express-fileupload");
  const { Profile } = require("../modules/mongoose_models.js");
  const path = require("path");
  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");
  const flash = require("connect-flash");

  const router = express.Router();
  //set up middleware
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));
  router.use(fileUploader());
  router.use(flash());

  //check are they logged in, if they are then continue on with the rest of
  //the end point, if not return res.send
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send("You cannot view this profile due to not being logged in");
  }
  //this might not be necessary however it keeps user from accessing the
  //login page once they are already logged in
  function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect("/");
  }
  //end point gets hit from front end wishing to create a profile
  // for first time and takes FormData as req.body
  router.post("/create", async (req, res) => {
    let profilePic;
    let picPath = "";

    try {
      //ensure that there is no already existing profile (each email needs to be unique)
      const exists = await Profile.findOne({ email: req.body.email });
      if (exists)
        return res.send(
          "There is already an account with this email, please use another"
        );
      //create salt + hash to encrypt password.  As this may take time, await these
      //before attempting to add them to the newProfile object
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      //this does the file uploading, we have the picPath as an empty string so that we can
      //have it as a global variable outside of the function, this picPath will be passed into profile document
      picPath = await uploadFile(req.files, profilePic, picPath);

      const fName = req.body.fName;
      const sName = req.body.sName;
      const email = req.body.email;
      //set up new Profile object
      const newProfile = await new Profile({
        fName: fName,
        sName: sName,
        email: email,
        profilePath: picPath,
        password: hash,
      });
      //save to database
      newProfile.save((err, result) => {
        if (err) {
          //error handle
          console.log(err);
          res.status(500).send(err);
        }
        if (result) {
          //just send back the _id part of the object to ensure that it has been created
          const returnedProfile = { id: result._id };
          console.log("returned profile", returnedProfile);
          res.status(200).json(returnedProfile);
        }
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  });

  //unfortunately I do not know how to access the error message - will have to come back to this
  router.post(
    "/login",
    //authenticate set up a session through cookies - failure flash allows us to access the error
    //messages in the req body once redirected to the login/error
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/api/profile/login/error",
    }),
    (req, res) => {
      //send back the minimal amount to the client to navigate to in the web app
      res.send(req.user._id);
    }
  );

  //if there is a login error get sent to this.
  router.get("/login/error", (req, res) => {
    //req.flash allows us access to the messages from middleware
    const flashMessage = req.flash("message")[0];
    res.status(404).send(flashMessage);
  });
  //endpoint to send profile information back to client.  Middleware checks if the user
  //is logged on
  router.get("/:id", isLoggedIn, async (req, res) => {
    try {
      //find the profile async
      const result = await Profile.findById(req.params.id);
      //use destructuring to remove hashed password from the response object
      const { password, ...rest } = result._doc;
      //check to see if the client owns the profile which will determine what is
      //displayed on the client side (ability to edit)
      if (req.user._id.toString() === req.params.id) {
        rest.isLoggedIn = true;
        return res.status(200).json(rest);
      }

      res.status(200).send(rest);
    } catch (error) {
      console.log(error);
      res.status(404).send("Could Not Find Any Matching Profile");
    }
  });
  //edit profile End Point - middleware checks to see is the client logged in
  router.post("/edit", isLoggedIn, async (req, res) => {
    //check the client's id against the id of the profile
    if (req.user._id.toString() !== req.body.userId)
      return res
        .status(401)
        .send(
          "You are not signed in with the correct profile to edit this Profile"
        );
    //declare profile pic outside of the upload file function so that it can be accessed
    //outside the function once updated
    let profilePic;
    let profilePath = "";

    try {
      //uploads the file and returns the path of where it has been uploaded
      picPath = await uploadFile(req.files, profilePic, req.body.picPath);
      //find the profile by id
      const profileToUpdate = await Profile.findById(req.body.userId);
      //if the profile alread has a picture attached and there is no file sent in the
      //request, keep the profilePath the same
      if (
        (profileToUpdate.profilePath != "" ||
          profileToUpdate.profilePath != undefined) &&
        (req.files == undefined || req.files == null)
      ) {
        picPath = profileToUpdate.profilePath;
      }
      //make sure that the criteria is not null before updating
      if (req.body.fName != "undefined") profileToUpdate.fName = req.body.fName;
      if (req.body.sName != "undefined") profileToUpdate.sName = req.body.sName;
      if (req.body.email != "undefined") profileToUpdate.email = req.body.email;
      if (picPath != "" || picPath != undefined)
        profileToUpdate.profilePath = picPath;
      //result is the returned object of the newly saved profile
      const result = await profileToUpdate.save();
      //might be unnecessary to send the whole profile object back following saving - TO DO
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  });
  //simple request to get the profile picture - may need to add middleware to this
  //perhaps i should change the way the picture is uploaded due to the fact that it exposes
  //the file structure to the client
  router.get("/image/:pictureName", (req, res) => {
    const newPath = path.join(
      __dirname,
      "..",
      `/userProfilePics/${req.params.pictureName}`
    );

    res.sendFile(newPath);
  });
  //simple logout
  router.post("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).send("You Have Successfully Logged Out");
    });
  });

  async function uploadFile(file, profilePic, picPath) {
    //pass in req.file and if this exists we return a promise so
    // that the function can be called asyncronously elsewhere
    if (file) {
      return new Promise((resolve, reject) => {
        profilePic = file.userFile;
        picPath = path.join(
          __dirname,
          "..",
          "userProfilePics",
          profilePic.name
        );
        //this uploads the picture into the server directory and returns the promise on either
        //success or failure (resolve/reject)
        profilePic.mv(picPath, (err) => {
          if (err) {
            console.log("rejecting");
            return reject(`The file was not uploaded - Error:${err}`);
          }
          console.log("resolving");
          return resolve(picPath);
        });
      });
    }
    console.log("can't seem to find any file shouldn't trigger");
    return;
  }
  return router;
};
