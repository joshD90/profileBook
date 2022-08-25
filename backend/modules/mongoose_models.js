const mongoose = require("mongoose");

//set the schema for the profile
const profileSchema = mongoose.Schema({
  fName: { type: String, required: true },
  sName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePath: { type: String },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  password: { type: String },
});
//plug the schema into the profile model
const Profile = mongoose.model("Profile", profileSchema);

//create the blogSchema
const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imagePath: String,
  isPublic: { type: Boolean, default: false },
  profile: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
});
//plug the schema into the blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Profile, Blog };
