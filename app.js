const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression'); //compersing the size of request and responses.
const cors = require('cors');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Limit requests from same API
const limiter = rateLimit({
  max: 600,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Set security HTTP headers
app.use(helmet());

// Body parser
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(compression());

app.use(cors());

// Data sanitization against XSS
app.use(xss());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

//Routers Declare
const store = require('./routers/storeRouter');
const category = require('./routers/categoryRouter');
const product = require('./routers/productRouter');
const user = require('./routers/userRouter');
const calculation = require('./routers/calculationRouter');

//Routers Implementaion
app.use('/api/store', store);
app.use('/api/category', category);
app.use('/api/product', product);
app.use('/api/user', user);
app.use('/api/calculation', calculation);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on the API`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
