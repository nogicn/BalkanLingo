var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
const bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

// add salt to env
process.env.SALT = salt;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users_router');
const migration = require('./database/serialise');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(session({secret: "omgthissecretkeyissosecure"}));

app.use('/', indexRouter);
app.use('/user', usersRouter);

migration.migration();

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

//http.createServer(app).listen(3000);
module.exports = app;