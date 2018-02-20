var express = require('express');  // import express module
var bodyParser = require('body-parser');  //import for parsing POST and PUT requests
var routes = require ('./routes');           // routes are organized in one folder

var app = express(); //attaches Express functinality to app variable; creates server

                                // app.use statements processed in order of appearance
                                // bodyParser must come before routes in order for routes to use it

app.use(bodyParser.json());     // use json for POST and PUT
app.use('/', routes);           // when server starts, this grabs all routes

app.listen(3000, function() {   // start server
    console.log('Server listening on port 3000...');
});
