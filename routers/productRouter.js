const express = require('express');
const productContoller = require('../controllers/productContoller');
const Router = express.Router();

Router.route('/:id')
  .get(productContoller.getProducts)
  .post(productContoller.createProduct);

module.exports = Router;
