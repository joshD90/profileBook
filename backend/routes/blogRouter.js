module.exports = function (passport) {
  const express = require("express");
  const mongoose = require("mongoose");
  const { Blog, Profile } = require("../modules/mongoose_models.js");

  const router = express.Router();
  router.use(express.json());
  router.use(express.urlencoded({ extended: true }));

  //check are they logged in, if they are then continue on with the rest of
  //the end point, if not return res.send
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send("You cannot view this blog due to not being logged in");
  }
  //this might not be necessary however it keeps user from accessing the
  //login page once they are already logged in
  function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect("/");
  }
  //completes a db search based on ID and returns that object
  router.get("/:blogId", isLoggedIn, async (req, res) => {
    try {
      //search is async so await the result
      const result = await Blog.findById(req.params.blogId);
      //create a response object that so that we can add whether the blog belongs to
      //this user or they are just viewing it.  This will determine whether they can edit etc
      let responseObj = { content: result };
      if (req.user._id.toString() !== result.profile[0]._id.toString()) {
        responseObj.isOwner = false;
        return res.status(200).json(responseObj);
      }
      responseObj.isOwner = true;
      res.status(200).json(responseObj);
    } catch (error) {
      console.log(error);
      res.status(500).send("Could not find the blog that you were looking for");
    }
  });
  //this is for the first time creating a blog, middleware checks if logged in
  router.post("/create", isLoggedIn, async (req, res) => {
    //check whether the authenticated user has the same id as the id of the linked profile
    if (req.user._id.toString() !== req.body.profile_Id)
      return res.status(401).send("Cannot update the blog of another user");
    try {
      //build up the json object from the inputs sent over
      const blog = {
        title: req.body.blogTitle,
        body: req.body.blogBody,
        isPublic: req.body.isPublic,
        profile: req.body.profile_Id,
      };

      //formulate the new blog and save it to database
      const newBlog = await new Blog(blog);
      await newBlog.save();

      //make sure that there is a profile attached to this request and
      //at it in to the linked key-value pair of the document
      if (blog.profile) {
        const profile = await Profile.findById(blog.profile);
        profile.blogs.push(newBlog);
        profile.save();
        res.json(newBlog);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  });
  //End point for editing the blog - middleware checks if logged in
  router.post("/edit", isLoggedIn, async (req, res) => {
    try {
      //find the blog by the ID that has been sent over
      const blogToEdit = await Blog.findById(req.body.blogId);
      //check that the user owns the blog by comparing id to the blogs linked profile ID
      if (req.user._id.toString() !== blogToEdit.profile.toString())
        return res.status(401).send("This is not your blog to edit");
      //as we are saving the whole blog object we don't want to overwrite any of the existing blog
      //with null properties.  Append any properties that have been changed
      if (req.body.blogTitle) {
        blogToEdit.title = req.body.blogTitle;
      }
      if (req.body.blogBody) blogToEdit.body = req.body.blogBody;
      if (req.body.isPublic) blogToEdit.isPublic = req.body.isPublic;

      //save the blog to the database
      await blogToEdit.save();
      //return the response object
      res.status(200).json({
        blog: blogToEdit,
        message: "Your Blog Was Updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  });

  //this end point is hit to gather all the blogs associated with a profile
  router.get("/populateBlog/:profileId", isLoggedIn, async (req, res) => {
    try {
      const result = await Profile.findById(req.params.profileId);
      //.populate expands all the blogs linked to this profile
      result.populate("blogs", (err, result) => {
        //creating a response object so that we can add additional information to the response
        let responseObj = { blogs: result.blogs };
        //check whether the user session id is the same as the id associated with the blogs linked profile
        if (req.user._id.toString() !== req.params.profileId) {
          responseObj.isOwner = false;
          //as some of the blogs can be set to private, if the user is not the owner then filter out
          //any of the array of documents that are private
          responseObj.blogs = responseObj.blogs.filter(
            (document) => document.isPublic === true
          );
        } else responseObj.isOwner = true;
        if (err) return res.send(err.message);
        res.json(responseObj);
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  });
  return router;
};
