const express = require('express');
const authController = require('../controllers/authController');
const ExpressBrute = require('express-brute');

const failCallback = function (req, res, next, nextValidRequestDate) {
  return next(new AppError('to Much Log In,Please Try Again Later!', 404));
};
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store, {
  freeRetries: 15,
  minWait: 5 * 60 * 1000,
  maxWait: 60 * 60 * 1000,
  failCallback: failCallback,
});

const Router = express.Router();
Router.post('/signup', authController.signup);
Router.post('/login', bruteforce.prevent, authController.login);

module.exports = Router;
