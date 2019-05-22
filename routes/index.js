const express = require("express");
const router = express.Router();
const Item = require("../models/item");
/* GET home page */
router.get("/items", (req, res, next) => {
  Item.find().then(items => {
    res.json(items);
  });
  // res.render("index");
});

router.get("/items/search", (req, res, next) => {
  console.log(req.query.term);
  let searchTerm = req.query.term.toLowerCase();
  console.log(searchTerm);
  let expression = new RegExp(searchTerm, "i");
  Item.find({ name: { $regex: expression } }).then(found => {
    console.log(found);
    res.json(found);
  });
});

router.get("/items/:id", (req, res, next) => {
  Item.findById(req.params.id).then(foundItem => {
    console.log(foundItem);
    res.json(foundItem);
  });
});

module.exports = router;
