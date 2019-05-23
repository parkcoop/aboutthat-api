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
  glycemicIndex: Number,
  containsGluten: Boolean,
  img: String,
  credit: String,
  keywords: Array,
  mayContain: Array,
  sources: Array
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
