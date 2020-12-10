const DB = require('../utils/connection');
const AppError = require('../utils/appError');

exports.getCategorys = (req, res, next) => {
  let query = 'SELECT * FROM store_category';
  DB.query(query, (err, result) => {
    if (err) return next(err);

    if (result.length == 0) {
      return res.status(200).json({
        status: 'success',
        result,
      });
    }

    let categorysIdInAStore = [];
    result.forEach((element) => {
      if (element.store_id.toString() === req.params.id.toString()) {
        categorysIdInAStore.push(element.category_id.toString());
      }
    });

    query = 'SELECT * FROM category';
    DB.query(query, (error, newResult) => {
      if (error) return next(error);

      let lastResult = [];

      newResult.forEach((element) => {
        if (categorysIdInAStore.includes(element.id.toString())) {
          lastResult.push(element);
        }
      });

      res.status(200).json({
        status: 'success',
        result: lastResult,
      });
    });
  });
};

exports.createCategory = (req, res, next) => {
  if (!req.body.name || !req.body.photo)
    return next(new AppError('Please fill require fields', 400));

  let query = `INSERT INTO category (name, photo)
    VALUES ('${req.body.name}','${req.body.photo}');`;

  DB.query(query, (err, result) => {
    if (err) return next(err);
    query = `INSERT INTO store_category (store_id, category_id)
    VALUES ('${req.params.id}','${result.insertId}');`;
    DB.query(query, (error, _) => {
      if (error) return next(error);
    });

    res.status(200).json({
      status: 'success',
      result: { id: result.insertId, ...req.body },
    });
  });
};
