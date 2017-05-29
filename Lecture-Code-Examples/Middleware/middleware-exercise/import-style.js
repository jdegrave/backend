var express = require('express');
var middleware = require('./app.middleware.js');
var app = express();


app.use(middleware);

app.get('/', function (req, res){
    res.status(200).send('Brain fog...');
});

app.get('/chocolate', function (req, res){
    res.status(200).send('Give us chocolate!');
});


app.listen(3000);
