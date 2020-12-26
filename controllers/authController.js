const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const DB = require('../utils/connection');
const { promisify } = require('util');
const knex = require('../db/knex');
const catchasync = require('../utils/CatchAsync');

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (userId, res) => {
  const token = signToken(userId);
  const expiresIn = new Date(
    Date.now() + process.env.JWT_EXPIRES_IN_NUMBER * 24 * 60 * 60 * 1000
  );
  res.status(200).json({
    status: 'success',
    token,
    expiresIn,
  });
};

exports.signup = catchasync(async (req, res, next) => {
  if (!req.body.name || !req.body.email)
    return next(new AppError('Please fill require fields', 400));
  const result = await knex('user').insert({
    name: req.body.name,
    email: req.body.email,
  });
  createSendToken(result[0], res);

  // let query = `INSERT INTO user (name, email)
  //   VALUES ('${req.body.name}','${req.body.email}');`;

  // DB.query(query, (err, result) => {
  //   if (err) return next(err);
  //   createSendToken(result.insertId, res);
  // });
});

exports.login = catchasync(async (req, res, next) => {
  if (!req.body.email)
    return next(new AppError('Please fill require fields', 400));

  const result = await knex('user').where('email', req.body.email.toString());
  if (result.length == 0) {
    return next(new AppError('No user found with this emial address!', 401));
  }
  createSendToken(result[0], res);
});
// exports.login = (req, res, next) => {
//   if (!req.body.email)
//     return next(new AppError('Please fill require fields', 400));

//   const query = 'SELECT * FROM user';
//   DB.query(query, (err, result) => {
//     if (err) return next(err);

//     if (result.length == 0) {
//       return next(new AppError('No user found with this emial address!', 401));
//     }

//     const isFound = result.some((user) => {
//       if (user.email.toString() === req.body.email.toString()) {
//         return true;
//       }
//     });
//     if (isFound) {
//       return createSendToken(result[0].id, res);
//     }
//     next(new AppError('No user found with this emial address!', 401));
//   });
// };

exports.protect = async (req, _, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  try {
    await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return next(error);
  }
};
