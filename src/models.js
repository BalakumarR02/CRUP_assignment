
const mongoose = require("mongoose");

const productsSchema = require("./schema")

const Product = mongoose.model("Products", productsSchema);

module.exports = Product;