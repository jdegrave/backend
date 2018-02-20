// weather data provided by www.wunderground.com
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var wunderground = require('wunderground')('a1234a5ae0147cb5');

var app = express();

app.use(bodyParser.json());  //body-parser first, so routes can use it
app.use('/', routes);



app.listen(3000, function () {
  console.log('Listening on PORT 3000...');
});
