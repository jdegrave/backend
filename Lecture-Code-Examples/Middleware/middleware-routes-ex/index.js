var express  = require('express');
var routes = require('./routes');
var app = express();



app.use(function (req, res, next){
  console.log('Hello from root middleware!');
  next();
});

// this says if it the request is /chocolate, use the route folder
// remember, the 'chocolate' folder doesn't have to physically exist on the
// server (it doesn't in this case. )
app.use('/chocolate', routes);

app.get('/', function(req, res){
  res.status(200).send('You\'re in the root, baby!');
});


app.listen(3000, function (){
  console.log('Server listening on port 3000...');
});
