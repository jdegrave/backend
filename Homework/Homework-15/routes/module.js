var cities = require('./cities');
var wunderground = require('wunderground')('a1234a5ae0147cb5');
//alternate key: ('12d30f869f013572')

function getCitiesInfo(arrCities, actions) {

    // map all the alamanc results into an array of promises
    var allCityData = arrCities.map(function (query) {
        return new Promise(function (resolve, reject) {
            wunderground.execute(actions, query, function (err, results) {
                if (err){
                    console.log(err);
                    reject(err);
                } else {
                    console.log('info from wunderground: ', results);
                    resolve (results); //res.status(200).json(info);
                }
            });
        });
    });
}


function getCityInfo (id) {
  for (var i = 0; i < cities.length; i++){
    if(id.toString() === cities[i].id.toString()){
      return cities[i];
    }
  }
  return false;
}

module.exports = {
                    getAlmanacInfo : getAlmanacInfo,
                    getCityInfo : getCityInfo
                  };
