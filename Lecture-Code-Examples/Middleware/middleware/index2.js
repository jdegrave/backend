var express = require('express');
var app = express();

// this is middleware
// takes a function as its argument
// req is an Object
// res is an Object
// next is a Function
app.use(function(req, res, next){
  console.log('Hello from my first middlware!');
  next();  // if you don't have next, can't execute the next lines of code in the file
          // app.get ... doesn't every get executed,
});


app.get('/', function( req, res){
    res.status(200).send('GET /');
});

app.get('/coffee', function(req, res){
    res.status(200).send("GET /coffee");
});

app.listen(3000, function(){
    console.log('middleware action is Listening...');
});
