const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: String,
  contributors: Array,
  description: Array,
  keto: Boolean,
  vegan: Boolean,
  paleo: Boolean,
  dogToxic: Boolean,
  kidSafe: Boolean,
  containsGluten: Boolean,
  img: String,
  credit: String,
  keywords: Array,
  mayContain: String,
  sources: String
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
