var mongodb = require('mongoose');
var Location = require('../models/location.model');
var locationsFromDB = [];


module.exports = {
                    locationsFromDB : locationsFromDB,
                    fetchAllLocations : fetchAllLocations,
                    fetchLocationIdByCityCode : fetchLocationIdByCityCode,
                    fetchCityByCityCode : fetchCityByCityCode,
                    saveAllLocations : saveAllLocations,
                    resetActiveToFalse : resetActiveToFalse
                };

function fetchAllLocations () {
    return locationsFromDB = Location.find({}).sort({ cityCode: 1 }).exec()
        .then(function (results) {
            locationsFromDB = results;
            return locationsFromDB;
        });

}

function saveAllLocations (locationsToSeed) {
    return Location.insertMany(locationsToSeed);
}

function fetchLocationIdByCityCode (cityCode) {
    return Location.find({ cityCode : cityCode })
        .exec()
        .then(function (location) {
            return location[0]._id;
        });
}

function fetchCityByCityCode (cityCode) {
    return Location.find({ cityCode : cityCode })
        .exec()
        .then(function (location) {
            return location[0].city;
        });
}

function resetActiveToFalse (activeLocation) {
    var index = locationsFromDB.map(function (elem) { return elem.cityCode; }).indexOf(activeLocation.cityCode);

    locationsFromDB[index].active = false;

    return locationsFromDB[index];
}
