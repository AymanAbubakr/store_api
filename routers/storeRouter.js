const express = require('express');
const storeController = require('../controllers/storeController');
const Router = express.Router();

Router.route('/')
  .get(storeController.getStores)
  .post(storeController.createStore);

module.exports = Router;
