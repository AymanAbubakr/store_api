const express = require('express');
const categoryController = require('../controllers/categoryController');
const Router = express.Router();

Router.route('/:id')
  .get(categoryController.getCategorys)
  .post(categoryController.createCategory);

module.exports = Router;
