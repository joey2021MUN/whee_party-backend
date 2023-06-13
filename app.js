var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// whee party
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var packageInfoRouter = require('./routes/package_info');
var slotAvailabilityRouter = require('./routes/slot_availability');
var orderRouter = require('./routes/order');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// whee party api
app.use('/', indexRouter);
app.use('/order', orderRouter);
app.use('/users', usersRouter);
app.use('/package_info', packageInfoRouter)
app.use('/check-slot-availability', slotAvailabilityRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
