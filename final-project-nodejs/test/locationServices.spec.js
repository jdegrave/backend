
var chai = require('chai');
var expect = chai.expect;
var chaiHTTP = require('chai-http');
var assertType = require('chai-asserttype');


chai.use(assertType);
chai.use(chaiHTTP);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Location = require('../models/location.model');
var locationServices = require('../services/location.services');
var seedLocations  = require('../seed/locations');

describe.skip ('Location Services Validation Tests:\n', function (){
    describe('Fetch All Locations validation tests:\n', function (){
        describe ('Negative tests for fetching all locations:\n', function () {

        });
        describe ('Positive tests for fetching all locations:\n', function () {
            it('should return all locations in the database', function (){
                return locationServices.fetchAllLocations()
                    .then(function (results){
                        expect(results).to.exist;
                        expect(results).to.be.an.array;
                        expect(results).to.contain.an.object;
                        expect(results[0].city).to.equal('Fort Smith');
                        expect(results[0].cityCode).to.equal('FSM');
                        expect(results[0].active).to.equal(false);
                        expect(results[7].city).to.equal('Tulsa');
                        expect(results[7].cityCode).to.equal('TUL');
                        expect(results[7].active).to.equal(false);
                    });
            });
        });
    });
    describe ('Fetch Location ID By CityCode validation tests:\n', function (){
        describe ('Negative tests for fetchLocationIdByCityCode:\n', function () {

        });
        describe ('Positive tests for fetchLocationIdByCityCode:\n', function () {
            it ('should return the ObjectId for the cityCode passed to it', function (){
                var cityCode = 'TUL';
                return locationServices.fetchLocationIdByCityCode(cityCode)
                    .then(function (results) {
                        expect(results.toString()).to.equal('58d3f839936b0405bcda9bd8');
                    });
            });
        });
    });
    describe ('Fetch City By CityCode validation tests:\n', function (){
        describe ('Negative tests for fetchCityByCityCode:\n', function () {

        });
        describe ('Positive tests for fetchCityByCityCode:\n', function () {
            it ('should return the city descriptor for PLK', function (){
                var cityCode = 'PLK';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Branson');
                    });
            });
            it ('should return the city descriptor for JP6', function (){
                var cityCode = 'JP6';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Joplin Downtown 7th St');
                    });
            });

            it ('should return the city descriptor for JLN', function (){
                var cityCode = 'JLN';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Joplin Airport');
                    });
            });

            it ('should return the city descriptor for FSM', function (){
                var cityCode = 'FSM';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Fort Smith');
                    });
            });
            it ('should return the city descriptor for LCL', function (){
                var cityCode = 'LCL';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Local');
                    });
            });
            it ('should return the city descriptor for OKC', function (){
                var cityCode = 'OKC';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Oklahoma City');
                    });
            });
            it ('should return the city descriptor for SGF', function (){
                var cityCode = 'SGF';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Springfield');
                    });
            });
            it ('should return the city descriptor for TUL', function (){
                var cityCode = 'TUL';
                return locationServices.fetchCityByCityCode(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('Tulsa');
                    });
            });
        });
    });
    describe('Reset Active Property validation tests:\n', function (){
        describe ('Negative tests for resetting active property to false:\n', function () {

        });
        describe ('Positive tests for resetting active property to false:\n', function () {
            it('should reset the location of the last trip to false', function (){
                var lastActiveLocation = {
                                            _id : '58d3f839936b0405bcda9bd8',
                                            city : 'Tulsa',
                                            cityCode : 'TUL',
                                            active : true
                                        };
                var updatedLocation = locationServices.resetActiveToFalse(lastActiveLocation);
                expect(updatedLocation.active).to.equal(false);
            });
        });
    });
});
