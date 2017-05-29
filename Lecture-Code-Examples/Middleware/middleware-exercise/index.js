var express = require('express');

var app = express();


app.use(function(req, res, next){
   console.log('This is my basic middleware...');
   next();
});

app.get('/', function (req, res){
    res.status(200).send('Brain fog...');
});

app.get('/chocolate', function (req, res){
    res.status(200).send('Give us chocolate!');
});


app.listen(3000);
