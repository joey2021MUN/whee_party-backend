var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

// swagger config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Whee Party API',
      description: 'Whee Party API Information',
      version: '1.0.1',
      contact: {
        name: 'Joey',
      },
      servers: ['http://localhost:5000'],
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      BearerAuth: []
    }],
  },
  apis: ['./routes/*.js', "./routes/admin/*.js"],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// whee party
var indexRouter = require('./routes/index');
var signInRouter = require('./routes/signin');
var greetingsRouter = require('./routes/greetings');
var packageInfoRouter = require('./routes/package_info');
var slotAvailabilityRouter = require('./routes/slot_availability');
var orderRouter = require('./routes/order');
var bulkBlockRouter = require('./routes/admin/bulk_block');
var bulkUnblockRouter = require('./routes/admin/bulk_unblock');

const authentication_token = require('./authentication_token');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// whee party APIs
app.use('/', indexRouter);
app.use('/signin', signInRouter);
app.use('/package_info', packageInfoRouter);
app.use('/check-slot-availability', slotAvailabilityRouter);

app.use('/greetings', authentication_token, greetingsRouter);
app.use('/order', authentication_token, orderRouter);
app.use('/admin', authentication_token, bulkBlockRouter);
app.use('/admin', authentication_token, bulkUnblockRouter);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.title = 'Whee Party';
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
