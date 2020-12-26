const DB = require('../utils/connection');
const AppError = require('../utils/appError');
const knex = require('../db/knex');
const catchasync = require('../utils/CatchAsync');

exports.getCategorys = catchasync(async (req, res, next) => {
  //! First way
  // const result = await knex('category').whereIn(
  //   'id',
  //   knex('store_category')
  //     .select('category_id')
  //     .where('store_id', req.params.id)
  // );

  //! OR

  //! Second way
  const result = await knex
    .select('category.id', 'category.name', 'category.photo')
    .from('category')
    .join('store_category', function () {
      this.on('category.id', '=', 'store_category.category_id');
      this.andOnVal('store_category.store_id', '=', req.params.id.toString());
    });

  res.status(200).json({
    status: 'success',
    result,
  });
});

//! third way
// exports.getCategorys = (req, res, next) => {
//   let query = 'SELECT * FROM store_category';
//   DB.query(query, (err, result) => {
//     if (err) return next(err);

//     if (result.length == 0) {
//       return res.status(200).json({
//         status: 'success',
//         result,
//       });
//     }

//     let categorysIdInAStore = [];
//     result.forEach((element) => {
//       if (element.store_id.toString() === req.params.id.toString()) {
//         categorysIdInAStore.push(element.category_id.toString());
//       }
//     });

//     query = 'SELECT * FROM category';
//     DB.query(query, (error, newResult) => {
//       if (error) return next(error);

//       let lastResult = [];

//       newResult.forEach((element) => {
//         if (categorysIdInAStore.includes(element.id.toString())) {
//           lastResult.push(element);
//         }
//       });

//       res.status(200).json({
//         status: 'success',
//         result: lastResult,
//       });
//     });
//   });
// };

exports.createCategory = catchasync(async (req, res, next) => {
  if (!req.body.name || !req.body.photo)
    return next(new AppError('Please fill require fields', 400));

  const result = await knex('category').insert({
    name: req.body.name,
    photo: req.body.photo,
  });

  await knex('store_category').insert({
    store_id: req.params.id,
    category_id: result[0],
  });

  res.status(200).json({
    status: 'success',
    result: { id: result[0], ...req.body },
  });
});

// exports.createCategory = (req, res, next) => {
//   if (!req.body.name || !req.body.photo)
//     return next(new AppError('Please fill require fields', 400));

//   let query = `INSERT INTO category (name, photo)
//     VALUES ('${req.body.name}','${req.body.photo}');`;

//   DB.query(query, (err, result) => {
//     if (err) return next(err);
//     query = `INSERT INTO store_category (store_id, category_id)
//     VALUES ('${req.params.id}','${result.insertId}');`;
//     DB.query(query, (error, _) => {
//       if (error) return next(error);
//     });

//     res.status(200).json({
//       status: 'success',
//       result: { id: result.insertId, ...req.body },
//     });
//   });
// };
