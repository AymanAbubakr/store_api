const DB = require('../utils/connection');
const AppError = require('../utils/appError');
const knex = require('../db/knex');
const catchasync = require('../utils/CatchAsync');

exports.getProducts = catchasync(async (req, res, next) => {
  const result = await knex('product').where(
    'categoryId',
    req.params.id.toString()
  );
  res.status(200).json({
    status: 'success',
    result,
  });
});
// exports.getProducts = (req, res, next) => {
//   let query = 'SELECT * FROM product';
//   DB.query(query, (err, result) => {
//     if (err) return next(err);

//     if (result.length == 0) {
//       return res.status(200).json({
//         status: 'success',
//         result,
//       });
//     }

//     let productsInACategory = result.filter(
//       (product) => product.categoryId.toString() === req.params.id.toString()
//     );

//     res.status(200).json({
//       status: 'success',
//       result: productsInACategory,
//     });
//   });
// };

exports.createProduct = catchasync(async (req, res, next) => {
  if (!req.body.name || !req.body.photo || !req.body.price)
    return next(new AppError('Please fill require fields', 400));

  const result = await knex('product').insert({
    name: req.body.name,
    photo: req.body.photo,
    price: req.body.price,
    categoryId: req.params.id,
  });
  res.status(200).json({
    status: 'success',
    result: { id: result.insertId, ...req.body },
  });
});
// exports.createProduct = (req, res, next) => {
//   if (!req.body.name || !req.body.photo || !req.body.price)
//     return next(new AppError('Please fill require fields', 400));

//   let query = `INSERT INTO product (name, photo, price,categoryId)
//     VALUES ('${req.body.name}','${req.body.photo}','${req.body.price}','${req.params.id}');`;

//   DB.query(query, (err, result) => {
//     if (err) return next(err);
//     res.status(200).json({
//       status: 'success',
//       result: { id: result.insertId, ...req.body },
//     });
//   });
// };
