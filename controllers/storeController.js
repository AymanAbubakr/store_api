const DB = require('../utils/connection');
const AppError = require('../utils/appError');

exports.getStores = (req, res, next) => {
  const query = 'SELECT * FROM store';
  DB.query(query, (err, result) => {
    if (err) return next(err);

    res.status(200).json({
      status: 'success',
      result,
    });
  });
};
exports.createStore = (req, res, next) => {
  if (!req.body.name || !req.body.photo || !req.body.location)
    return next(new AppError('Please fill require fields', 400));

  let query = `INSERT INTO store (name, photo, location)
    VALUES ('${req.body.name}','${req.body.photo}','${req.body.location}');`;

  DB.query(query, (err, result) => {
    if (err) return next(err);
    res.status(200).json({
      status: 'success',
      result: { id: result.insertId, ...req.body },
    });
  });
};
