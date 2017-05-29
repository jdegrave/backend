require('dotenv').config();
var config = require('./config/config');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoDBStore = require('connect-mongodb-session')(session);
var engines = require('consolidate');
var errMiddleware = require('./middleware/errMiddleware');
var logMiddleware = require('./middleware/logging');
var createLogger = require('./utils/logger.utils');
var socketIO = require('socket.io');
var passport = require('passport');
var routes = require('./routes')(passport);
var mongodb = require('./utils/mongodb.utils');
var moment = require('moment');
var configPassport = require('./config/passport.config');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');

var server;
var io;
var tripServices = require('./services/trip.services');
var driverServices = require('./services/driver.services');

var app = express();

var port = config.port;
var env = process.env.ENV || 'dev';

// connect to database, set passport configuration
mongodb.createEventListeners();
mongodb.connect();
configPassport(passport);

//var logger = createLogger(process.env.ENV);
var logger = createLogger(env);
tripServices.configure(logger);

// set up express application
app.use(logMiddleware(logger));
app.use(errMiddleware);
app.use(cookieParser());  // needed for authentication
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));


// set up html template engines
app.engine('html', engines.handlebars);   //associate .html ext with handlbars
app.set('view engine', 'html');           //set templating engine for html
app.set('views', __dirname + '/views');   // location of templates

// serve css files
app.use(express.static(__dirname + '/assets'));

// use MongoDB to store session info
var store = new mongoDBStore ({ uri : process.env.MONGODB_URI,
                                collection : 'roboSmsSessions'
                              });


store.on('error', function (error) {
    logger.error(error);
});
// Create and manage HTTP sessions for all requests;
// Needed for Twilio and passportjs for authentication
app.use(session({
    secret: config.secret,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());  // persistent login session
app.use(flash()); //



// routes
app.use('/', routes);

server = http.createServer(app);
server.listen(port, function () {
    logger.info('Robo-SMS Express app listening on port %s ...', port);
});

io = socketIO(server);

module.exports = app;  // export our module for testing - auto starts the server for tests
