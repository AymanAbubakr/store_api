const DB = require('../utils/connection');
const AppError = require('../utils/appError');
const knex = require('../db/knex');
const catchasync = require('../utils/CatchAsync');

exports.getStores = catchasync(async (req, res, next) => {
  const result = await knex('store');
  res.status(200).json({
    status: 'success',
    result,
  });
});
// exports.getStores = (req, res, next) => {
//   const query = 'SELECT * FROM store';
//   DB.query(query, (err, result) => {
//     if (err) return next(err);

//     res.status(200).json({
//       status: 'success',
//       result,
//     });
//   });
// };
exports.createStore = catchasync(async (req, res, next) => {
  if (!req.body.name || !req.body.photo || !req.body.location)
    return next(new AppError('Please fill require fields', 400));

  const result = await knex('store').insert({
    name: req.body.name,
    photo: req.body.photo,
    location: req.body.location,
  });
  res.status(200).json({
    status: 'success',
    result: { id: result.insertId, ...req.body },
  });
});
// exports.createStore = (req, res, next) => {
//   if (!req.body.name || !req.body.photo || !req.body.location)
//     return next(new AppError('Please fill require fields', 400));

//   let query = `INSERT INTO store (name, photo, location)
//     VALUES ('${req.body.name}','${req.body.photo}','${req.body.location}');`;

//   DB.query(query, (err, result) => {
//     if (err) return next(err);
//     res.status(200).json({
//       status: 'success',
//       result: { id: result.insertId, ...req.body },
//     });
//   });
// };
