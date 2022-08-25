const express = require("express");
const mongoose = require("mongoose");
const { Profile } = require("../modules/mongoose_models.js");

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  const criteria = req.body.criteria;
  const searchTerm = req.body.searchTerm;
  let filteredResult = [];

  try {
    //if the user has typed the full name of the profile they are searching
    //for we need to break this down into their first name and second name
    if (criteria === "fullName") {
      console.log("fullName criteria has been selected");
      const firstHalf = searchTerm.slice(0, searchTerm.indexOf(" "));
      const secondHalf = searchTerm.slice(
        searchTerm.lastIndexOf(" ") + 1,
        searchTerm.length
      );

      const fullNameList = await Profile.find({
        fName: firstHalf,
        sName: secondHalf,
      });
      //filter out unnecessary + sensitve information through ...rest operator
      fullNameList.forEach((result) => {
        const { blogs, password, ...rest } = result._doc;
        fiteredResult.push(rest);
      });
      return res.status(200).send(filteredResult);
    }
    //await this bit of code
    const result = await Profile.find({ [criteria]: searchTerm });
    //filter out unnecessary + sensitve information through ...rest operator
    result.forEach((result) => {
      const { blogs, password, ...rest } = result._doc;
      filteredResult.push(rest);
    });

    res.status(200).send(filteredResult);
  } catch (error) {
    res.status(500).send(error.message + "Could not find a matching Profile");
  }
});

module.exports = router;
