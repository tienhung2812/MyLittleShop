var mongoose = require("mongoose");
var Product = require("../models/Product");

var productController = {};

// Show list of products
productController.list = function(req, res) {
  Product.find({}).exec(function (err, products) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/products/index", {products: products});
    }
  });
};

// Show product by id
productController.show = function(req, res) {
  Product.findOne({_id: req.params.id}).exec(function (err, product) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/products/show", {product: product});
    }
  });
};

// Create new product
productController.create = function(req, res) {
  res.render("../views/products/create");
};

// Save new product
productController.save = function(req, res) {
  var product = new Product(req.body);

  product.save(function(err) {
    if(err) {
      console.log(err);
      res.render("../views/products/create");
    } else {
      console.log("Successfully created an product.");
      res.redirect("/products/show/"+product._id);
    }
  });
};

// Edit an employee
productController.edit = function(req, res) {
  Product.findOne({_id: req.params.id}).exec(function (err, product) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/products/edit", {product: product});
    }
  });
};

// Update an employee
productController.update = function(req, res) {
  Product.findByIdAndUpdate(req.params.id, { $set: { product_code: req.body.product_code, price: req.body.price, stock: req.body.stock }}, { new: true }, function (err, product) {
    if (err) {
      console.log(err);
      res.render("../views/products/edit", {product: req.body});
    }
    res.redirect("/products/show/"+product._id);
  });
};

// Delete an employee
productController.delete = function(req, res) {
  Product.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Product deleted!");
      res.redirect("/products");
    }
  });
};

module.exports = productController;