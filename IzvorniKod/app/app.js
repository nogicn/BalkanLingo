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



var indexRouter = require('./routes/index_router');
var usersRouter = require('./routes/users_router');
var dictionaryRouter = require('./routes/dictionary_router');
const migration = require('./database/serialise');
var martinRouter = require('./routes/martin.js');

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
app.use('/dictionary', dictionaryRouter);
app.use('/martin', martinRouter);

if (process.env.MIGRATE === 'true') {
  migration.migration();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render("forOFor", {
    status: 404,
    errorText: "Stranica ne postoji",
    link: "/",
  });
  return;
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