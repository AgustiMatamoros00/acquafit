var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Importar la conexión a la base de datos
const db = require('./repositories/db');

// Importar routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users_routes');
const authRouter = require('./routes/auth_routes');
const workoutsRouter = require('./routes/workout_routes');
const exercisesRouter = require('./routes/exercise_routes');
const setsRouter = require('./routes/set_routes');
const workoutXExerciseRouter = require('./routes/workout_x_exercise_routes');

var app = express();

// Hacer la conexión a la base de datos disponible globalmente
app.locals.db = db;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/workouts', workoutsRouter);
app.use('/exercises', exercisesRouter);
app.use('/sets', setsRouter);
app.use('/workout_x_exercise', workoutXExerciseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const message = err.message;
  const error = req.app.get('env') === 'development' ? err : {};

  // render the error response as JSON
  res.status(err.status || 500);
  res.json({
    message: message,
    error: error
  });
});

// Iniciar el servidor
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
