'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { sequelize, models } = require('./db');
const { User, Course } = models;
const courses = require('./routes/courses');
const users = require('./routes/users');
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging

app.use(morgan('dev'));
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
// TODO setup your api routes here

sequelize
    .authenticate()
    .then(() => {
      console.log("Database Connection successful");
    })
    .catch( err => {
      console.error("Database Connection unsuccessful:", err);
    });

sequelize
    .sync({ force: true })
    .then(() =>{
      console.log("Synchronizing models");
    })
    .catch(err => {
      console.error("Model Sync error:", err);
    });

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api/users', users);

app.use('/api/courses', courses);


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
