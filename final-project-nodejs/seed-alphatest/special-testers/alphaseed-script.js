var mongodb = require('../../utils/mongodb.utils');
var drivers = require('./special-testers');  // for testing only
var driverServices = require('../../services/driver.services');
var locations = require('../locations');
var locationServices = require('../../services/location.services');



mongodb.createEventListeners();
mongodb.connect();


//seed the drivers
driverServices.saveAllDrivers(drivers)
    .then(function (driversInserted){
        console.log('All drivers seeded.');
        mongodb.disconnect();
    }).catch(function (err){
        console.log('Error seeding drivers');
    });




//seed the locations
mongodb.createEventListeners();
mongodb.connect();

locationServices.saveAllLocations(locations)
    .then(function (locationsInserted){
        console.log('All locations seeded.');
    }).then(function (){
        mongodb.disconnect();
    }).catch(function (err){
        console.log('Error seeding locations');
    });
