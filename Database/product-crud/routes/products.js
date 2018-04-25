var express = require('express');
var router = express.Router();
var product = require("../controllers/ProductController.js");

// Get all products
router.get('/',function(req,res){ 
	product.list(req,res);
});

// Get single product by id
router.get('/show/:id',function(req,res){
	product.show(req,res);
});

//Create product
router.get('/create',function(req,res){
	product.create(req,res);
});

//Save product
router.post('/save',function(req,res){
	product.save(req,res);
});

// Edit product
router.get('/edit/:id', function(req, res) {
  product.edit(req, res);
});

// Edit update
router.post('/update/:id', function(req, res) {
  product.update(req, res);
});

// Edit update
router.post('/delete/:id', function(req, res, next) {
  product.delete(req, res);
});

module.exports = router;
