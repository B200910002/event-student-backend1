require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const { connectDB } = require("./config/db");
const { initializeRoles } = require("./models/UserRole.model");
const { initializeUniversities } = require("./models/University.model");
const fileUpload = require("express-fileupload");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const studentRouter = require('./routes/student');
const groupRouter = require('./routes/group');
const eventRouter = require('./routes/event');
const notificationRouter = require('./routes/notification');
const universityRouter = require('./routes/university');

const { protect, wrapResponse } = require("./middleware/middleware");

const app = express();

// database connection
connectDB();
initializeRoles();
initializeUniversities();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(fileUpload());

// middlewares
app.use(wrapResponse);

// routes
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/students', studentRouter);
app.use('/api/groups', groupRouter);
app.use('/api/events', eventRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/universities', universityRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
