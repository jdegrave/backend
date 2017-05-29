var express = require('express');
//var middleware = require('./app.middleware');
var app = express();

// this is middleware
// takes a function as its argument
// req is an Object
// res is an Object
// next is a Function

// this returns a function defintion but does not execute it
// this a function that returns another function
var middleware = {
  something: function(){
    return function (req, res, next){
      console.log('Hello from my first middleware');
      next();
    }
  }
}



app.use(middleware.something());
app.get('/', function( req, res){
    res.status(200).send('GET /');
});

app.get('/coffee', function(req, res){
    res.status(200).send("GET /coffee");
});

app.listen(3000, function(){
    console.log('middleware action is Listening...');
});
