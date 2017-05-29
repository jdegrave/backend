var express = require('express');
var app = express();


// this is middleware
var generalMiddleware = function (req, res, next){
  console.log('general middleware');
  next();
};

// this is middleware
var pigRouteMiddleware = function (req, res, next){
  console.log('pig route middleware');
  next();
};


app.use(generalMiddleware);



app.get('/', function (req, res){
    res.status(200).send('Brain fog...');
});

// this will execute pigRouteMiddleware function first, and then the
// anonymous function...
// if you put generalMiddleware in here, generalMiddleware would be executed
// twice 1st from app.use (generalMiddleware) and then here in this function
app.get('/flyingpigs', pigRouteMiddleware, function (req, res){
    res.status(200).send('GET /flyingpigs\n');
});


app.listen(3000);
