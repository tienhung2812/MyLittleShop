var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  product_code: String,
  price: Number,
  stock: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);