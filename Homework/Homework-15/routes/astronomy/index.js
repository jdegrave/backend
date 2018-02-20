var cities = require('../cities');
var astroInfo = require ('../module');
var router = require('express').Router();
var wunderground = require('wunderground')('a1234a5ae0147cb5');
// alternate key: ('12d30f869f013572')

router.get('/', function(req, res) {

    // get the cities that have almanac set to true
    var astroCities = cities.filter(function(city){
        if (city.astronomy === true) {
            return city;
        }
    });

    // required for wunderground API
    var actions = ['astronomy'];



    //map all the results from each city into an array of promises
    var allCityData = astroCities.map(function (query) {
        return new Promise(function (resolve, reject) {
            wunderground.execute(actions, query, function (err, results) {
                if (err){
                    reject(err);
                }
                resolve (results);
            });
        });
    });

    // use Promise.all so that it waits until all cities have data BEFORE
    // executing
    Promise.all(allCityData)
        .then(function(data){
            res.status(200).json(data);
        })
        .catch(function(err){
            res.status(500).send('Internal server error');
        });

    // working on getting this to call the same stuff from module.js
    // var allCityData = function (almaCities, actions) {
    //     return new Promise(function (resolve, reject) {
    //         var data = almaInfo.getAlmanacInfo(almaCities, actions);
    //         resolve(data);
    //     });
    // };

    // Promise.all(allCityData)
    //     .then(function(data){
    //         res.status(200).json(allCityData);
    //     }).catch(function(err){
    //         res.status(500).send('Internal server error');
    //     });

});

router.get(/\/q/, function (req, res) {
  var query = {};
  query.city = req.query.city;
  query.state = req.query.state;


  if (query.city !== "" && query.state !== "") {
    var actions = ['astronomy'];
    var info = {};

    wunderground.execute(actions, query, function (err, results){
      if (err){
        res.status(404).json(err);
      } else {
        info = Object.assign(results);
        res.status(200).json(info);
      }
    });
  } else {
    res.status(404).send('City not found. Invalid request');
  }
});

router.post('/', function (req, res) {
  var id = req.body.id;
  var city = req.body.city;
  var state = req.body.state;
  var astronomy = req.body.astronomy;
  var add = true;
  var city;

  if (id == '' || typeof id !== 'number'){
    add = false;
    console.log('id is ', add);
  }
  if (city == ''){
    add = false;
    console.log('city is: ' ,add);
  }

  if (state == ''){
    add = false;
    console.log('state is: ', add);
  }

  if (astronomy == ''){
    add = false;
    console.log('astronomy is: ', add);
  }


  if (add) {
    cities.push(req.body);

    city = astroInfo.getCityInfo(id);
    if (city){
      res.status(200).json(city);
    } else {
      res.status(500).send('Internal error. POST request failed');
    }

  } else {
    res.status(404).send('Invalid data in POST request');
  }




});

router.post('*', function (req, res){
  res.status(404).send('Invalid POST request!');
});

module.exports = router;
