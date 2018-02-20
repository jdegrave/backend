var router = require('express').Router();
var cities = require('./cities.js');


router.get('/', function (req, res){
  res.status(200).json(cities);
});

router.get('/:city', function (req, res){
  var city;

  for (var i = 0; i < cities.length; i++){
    if (cities[i].city.toString() === req.params.city.toString()){
      city = cities[i].city;
    }
  }
  res.status(200).json(city)
});

router.post('/', function (req, res){

  cities.push(req.body);
  res.status(200).json(req.body);
});

module.exports = router;
