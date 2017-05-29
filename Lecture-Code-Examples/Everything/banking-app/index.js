require ('dotenv').config();
var mongodb = require('./utils/mongodb.utils.js');

var express = require('express');
var routes = require('./routes');
//var bodyParser = require('body-parser');
var err500middleware = require('./middleware/500');
var loggingMiddleware = require('./middleware/logging');
var createLogger = require('./utils/logger');

var app = express();
var port = process.env.PORT;
var env = process.env.ENV || 'dev';

// connect to database
mongodb.createEventListeners();
mongodb.connect();

var logger = createLogger(env);

app.use(loggingMiddleware(logger));
app.use('/', routes);
app.use(err500middleware);

app.listen(port, function() {
    logger.info('Listening on port ' + port + '...');
});

module.exports = app;
