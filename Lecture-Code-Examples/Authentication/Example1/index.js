var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');  // before you initialize passport, you must initialize session
var routes  = require('./routes')(passport);

var configPassport = require('./configs/passport.config');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/authdemo');
configPassport(passport); // configure passport

var app = express();

// normally, put 'secret' phrase in an environment variable
// resave: everytime session comes back into the server, if the session hasn't changed it will
// resave it to the object store - we set it to false so it won't save it
// saveUninitialized: save the session in the store if it's new but not modified
app.use(session({ secret: 'menagerie of monkeys', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/assets', express.static(process.cwd() + '/assets'));
app.use('/', routes);


app.listen(3000, function (){
    console.log('Listening on port 3000...');
});
