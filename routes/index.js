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
  let newContributorsArray = [];
  console.log("current User", req.body.userId, req.body.username);
  Item.findById(req.params.id)
    .then(itemToUpdate => {
      itemToUpdate.description.push(req.body.description);
      itemToUpdate.sources.push(req.body.source);
      if (!itemToUpdate.contributors.includes(req.body.username)) {
        itemToUpdate.contributors.push(req.body.username);
      }
      itemToUpdate.save((err, doc) => {
        User.findById(req.body.userId).then(user => {
          user.additions.push({
            item: itemToUpdate.name,
            itemId: itemToUpdate._id,
            contribution: req.body.description
          });
          user.points += 10;
          user.save((err, doc) => {
            res.json({ updated: doc });
          });
        });
      });
    })
    .catch(err => console.error(err));
});

router.get("/users/:username", (req, res, next) => {
  User.findOne({ username: req.params.username }).then(user => {
    res.json(user);
  });
});

router.post("/addEntry", (req, res, next) => {
  console.log(req.body);
  let ketoBoolean = true;
  let veganBoolean = true;
  let paleoBoolean = true;
  if (req.body.keto == "false") {
    ketoBoolean = false;
  }
  if (req.body.vegan == "false") {
    veganBoolean = false;
  }
  if (req.body.paleo == "false") {
    paleoBoolean = false;
  }

  const newItem = new Item({
    name: req.body.name,
    source: [req.body.source],
    description: [req.body.description],
    vegan: veganBoolean,
    paleo: paleoBoolean,
    keto: ketoBoolean,
    mayContain: [req.body.mayContain],
    contributors: [req.body.user]
  });
  newItem.save().then(saved => {
    console.log(saved);
    User.findById(req.body.userId).then(user => {
      user.additions.push({
        item: newItem.name,
        itemId: newItem._id,
        contribution: newItem.description
      });
      user.points += 50;
      // console.log(user);
      user.save();
    });
  });
});

module.exports = router;
