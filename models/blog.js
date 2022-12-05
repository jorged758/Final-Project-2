const mongoose = require("mongoose");
// Defines schema of the blog collection in the database which contains following attributes and all are required
const BlogSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

module.exports = mongoose.model("cart", BlogSchema);
