const express = require('express');
const calculationContoller = require('../controllers/calculationController');
const authContorller = require('../controllers/authController');
const Router = express.Router();

Router.route('/').post(
  authContorller.protect,
  calculationContoller.getCalculation
);

module.exports = Router;
