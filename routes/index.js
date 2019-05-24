const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const User = require("../models/user");

/* GET home page */

router.get("/items", (req, res, next) => {
  Item.find().then(items => {
    res.json(items);
  });
  // res.render("index");
});

router.get("/items/search", (req, res, next) => {
  // console.log(req.query.term);
  let searchTerm = req.query.term.toLowerCase();
  // console.log(searchTerm);
  let expression = new RegExp(searchTerm, "i");
  Item.find({ name: { $regex: expression } }).then(found => {
    // console.log(found);
    res.json(found);
  });
});

router.get("/items/:id", (req, res, next) => {
  Item.findById(req.params.id).then(foundItem => {
    // console.log(foundItem);
    res.json(foundItem);
  });
});

router.post("/items/edit/:id", (req, res, next) => {
  let newDescriptionArray = [];
  let newSourceArray = [];
  console.log(req.body);
  Item.findById(req.params.id)
    .then(itemToUpdate => {
      newDescriptionArray = itemToUpdate.description;
      newSourceArray = itemToUpdate.sources;
      newDescriptionArray.push(req.body.description);
      newSourceArray.push(req.body.source);
      console.log("new description: " + newDescriptionArray);
      console.log("new source: " + newSourceArray);
      Item.findByIdAndUpdate(req.params.id, {
        description: newDescriptionArray,
        sources: newSourceArray
      })
        .then(somethingElse => {
          res.json({ final: somethingElse });
        })
        .catch(err => console.log(err));
      // console.log("new description:" newDescriptionArray);
    })
    .catch(err => {
      console.log(err);
    });
  // Item.findByIdAndUpdate(req.params.id, {
  //   description: newDescriptionArray
  // });
  // console.log("final description", newDescriptionArray);
});

router.get("/users/:username", (req, res, next) => {
  User.findOne({ username: req.params.username }).then(user => {
    res.json(user);
  });
});

module.exports = router;
