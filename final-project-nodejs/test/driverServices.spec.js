var chai = require ('chai');
var expect = chai.expect;
var chaiHTTP = require('chai-http');
var chaiDateTime = require('chai-datetime');
var assertArrays = require('chai-arrays');
var assertType = require('chai-asserttype');
var assertIntegers = require('chai-integer');

chai.use(assertArrays);
chai.use(assertType);
chai.use(assertIntegers);
chai.use(chaiHTTP);



var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Driver = require('../models/driver.model');
var driverServices = require('../services/driver.services');
var seedDrivers = require('../seed/drivers');


describe.skip('Driver services validation tests\n', function (){
    describe('Save One Driver validation tests:\n', function (){
        describe ('Negative tests for saving one driver:\n', function () {

        });
        describe ('Positive tests for saving one driver:\n', function () {
            it('should add a driver if all required properties are valid', function (){
                var driver = new Driver();
                driver =   {
                                firstName : 'Test',
                                lastName : 'Driver',
                                mobilePhone : '000-000-0000',
                                available : true,
                                seniorityRank : "",
                                scheduleNote : [{ note : 'test note'}],
                                firstToText : false,
                                text : true,
                                deleted : false
                            };

                return driverServices.saveOneDriver(driver)
                    .then(function (results){
                        if (results) {
                            //console.log('saveOneDriver then results: ', results);
                            expect(results).to.exist;
                            expect(results).to.be.an.object;
                            expect(results.firstName).to.equal('Test');
                            expect(results.lastName).to.equal('Driver');
                            expect(results.mobilePhone).to.equal('000-000-0000');
                            expect(results.deleted).to.be.false;
                            expect(results.text).to.be.true;
                            expect(results.firstToText).to.be.false;
                            expect(results.scheduleNote).to.be.an.array;
                            expect(results.scheduleNote[0]).to.exist;
                            expect(results.seniorityRank).to.equal(19);
                            expect(results.available).to.be.true;
                        } else {
                            expect(results).to.be.false;
                        }
                });
            });
        });
    });
    describe ('fetchAllDrivers validation tests:\n', function (){
        describe ('Negative tests for fetching all drivers:\n', function () {

        });
        describe('Positive tests for fetching all drivers:\n', function () {
            it('should return all drivers in the database', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (results){
                        expect(results).to.exist;
                        expect(results).to.be.an.array;
                        expect(results).to.be.contain.an.object;
                        expect(results[0].firstName).to.equal('Jim');
                        expect(results[0].lastName).to.equal('Westphal');
                        expect(results[0].mobilePhone).to.equal('479-936-4608');
                        expect(results[0].deleted).to.be.false;
                        expect(results[0].text).to.be.true;
                        expect(results[0].firstToText).to.be.true;
                        expect(results[0].scheduleNote).to.be.an.array;
                        expect(results[0].scheduleNote).to.have.be.empty;
                        expect(results[0].seniorityRank).to.equal(1);
                        expect(results[0].available).to.be.true;    // "lastName": "Westphal",

                    });
            });
        });
    });
    describe('fetchDriverByID validation tests:\n', function (){
        describe ('Negative tests for fetchDriverByID:\n', function () {
        });
        describe ('Positive tests for fetchDriverByID:\n', function () {
            it('should return the driver who\'s id matches the parameter', function (){
                return driverServices.fetchDriverByID('58e14af183fa6356879d7f0a')
                    .then(function (driverData){
                        expect(driverData).to.be.an.object;
                        expect(driverData._id.toString()).to.equal('58e14af183fa6356879d7f0a');
                        expect(driverData.firstName).to.equal('Jim');
                        expect(driverData.lastName).to.equal('Westphal');
                        expect(driverData.mobilePhone).to.equal('479-936-4608');
                        expect(driverData.deleted).to.be.false;
                        expect(driverData.text).to.be.true;
                        expect(driverData.firstToText).to.be.true;
                        expect(driverData.scheduleNote).to.be.an.array;
                        expect(driverData.scheduleNote).to.have.be.empty;
                        expect(driverData.seniorityRank).to.equal(1);
                        expect(driverData.available).to.be.true;
                    });
            })
        });
    });
    describe ('fetchDriverByName validation tests:\n', function (){
        describe ('Negative tests for fetchDriverByName:\n', function () {
        });
        describe ('Positive tests for fetchDriverByName:\n', function () {
        });
    });
    describe ('fetchDriverByPhoneNumber validation tests:\n', function (){
        describe ('Negative tests for fetchDriverByPhoneNumber:\n', function () {
        });
        describe ('Positive tests for fetchDriverByPhoneNumber:\n', function () {
            it('should fetch the driver with the matching mobile phone number', function(){
                return driverServices.fetchDriverByPhoneNumber('479-936-4608')
                    .then(function (driverData){
                        expect(driverData).to.be.an.object;
                        expect(driverData._id.toString()).to.equal('58e14af183fa6356879d7f0a');
                        expect(driverData.firstName).to.equal('Jim');
                        expect(driverData.lastName).to.equal('Westphal');
                        expect(driverData.mobilePhone).to.equal('479-936-4608');
                        expect(driverData.deleted).to.be.false;
                        expect(driverData.text).to.be.true;
                        expect(driverData.firstToText).to.be.true;
                        expect(driverData.scheduleNote).to.be.an.array;
                        expect(driverData.scheduleNote).to.have.be.empty;
                        expect(driverData.seniorityRank).to.equal(1);
                        expect(driverData.available).to.be.true;
                    });
            });
        });
    });
    describe.skip ('fetchAllDriversBySeniorityRank validation tests:\n', function (){
        describe ('Negative tests for fetchAllDriversBySeniorityRank:\n', function () {
        });
        describe ('Positive tests for fetchAllDriversBySeniorityRank:\n', function () {
        });
    });
    describe.skip ('fetchAllDriversByLastName validation tests:\n', function (){
        describe ('Negative tests for fetchAllDriversByLastName:\n', function () {
        });
        describe ('Positive tests for fetchAllDriversByLastName:\n', function () {
        });
    });
    describe ('fetchAllDriversByRankAvailableText validation tests:\n', function (){
        describe ('Negative tests for fetchAllDriversByAvailabilityandRank:\n', function () {
        });
        describe('Positive tests for fetchAllDriversByAvailabilityandRank:\n', function () {
            it ('should return all available drivers who text, by seniorityRank', function () {
                var validDrivers = driverServices.fetchAllDriversByRankAvailableText();

                expect(validDrivers).to.be.an.array;
                expect(validDrivers).to.have.an.object;
                for (var i = 0; i < validDrivers.length; i++){
                    expect(validDrivers[i]).to.have.deep.property('text', true);
                    expect(validDrivers[i]).to.not.have.deep.property('text', false);
                    expect(validDrivers[i]).to.have.deep.property('available', true);
                    expect(validDrivers[i]).to.not.have.deep.property('available', false);

                    if (i !== (validDrivers.length - 1)) {
                        expect(validDrivers[i].seniorityRank).to.be.below(validDrivers[i + 1].seniorityRank);
                    }
                }
                expect(validDrivers.length).to.equal(16);

            });
        });
    });
    describe.skip ('fetchAllAvailableDrivers validation tests:\n', function (){
        describe ('Negative tests for fetchAllAvailableDrivers:\n', function () {
        });
        describe ('Positive tests for fetchAllAvailableDrivers:\n', function () {
        });
    });
    describe.skip ('fetchAllUnavailableDrivers validation tests:\n', function (){
        describe ('Negative tests for fetchAllUnavailableDrivers:\n', function () {
        });
        describe ('Positive tests for fetchAllUnavailableDrivers:\n', function () {
        });
    });
    describe ('fetchFirstToText validation tests:\n', function (){
        describe ('Negative tests for fetchFirstToText:\n', function () {
            it('should return an error if more than one driver\'s firstToText property is set to true', function (){
                var testArrayDriverObjects = [
                                                {
                                                    firstName: 'David',
                                                    lastName: 'Moody',
                                                    mobilePhone: '479-899-1902',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: true,
                                                    scheduleNote: [],
                                                    seniorityRank: 13,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'Al',
                                                    lastName: 'Yanik',
                                                    mobilePhone: '479-366-0454',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 14,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'Larie',
                                                    lastName: 'Craig',
                                                    mobilePhone: '479-301-5955',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: true,
                                                    scheduleNote: [],
                                                    seniorityRank: 15,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'David',
                                                    lastName: 'Phillips',
                                                    mobilePhone: '479-621-1464',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: true,
                                                    scheduleNote: [],
                                                    seniorityRank: 16,
                                                    available: true
                                                }


                ];
                var indexOfFirstToText = driverServices.fetchFirstToText(testArrayDriverObjects);
                expect(indexOfFirstToText).to.throw.error;
                expect(indexOfFirstToText.message).to.equal('Error: Only one driver may have firstToText value set to true.');
            });
            it('should return an error if no driver\'s firstToText property is set to true', function (){
                var testArrayDriverObjects = [
                                                {
                                                    firstName: 'David',
                                                    lastName: 'Moody',
                                                    mobilePhone: '479-899-1902',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 13,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'Al',
                                                    lastName: 'Yanik',
                                                    mobilePhone: '479-366-0454',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 14,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'Larie',
                                                    lastName: 'Craig',
                                                    mobilePhone: '479-301-5955',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 15,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'David',
                                                    lastName: 'Phillips',
                                                    mobilePhone: '479-621-1464',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 16,
                                                    available: true
                                                }


                ];
                var indexOfFirstToText = driverServices.fetchFirstToText(testArrayDriverObjects);
                expect(indexOfFirstToText).to.throw.error;
                expect(indexOfFirstToText.message).to.equal('Error: There must be one driver with firstToText property set to true.');
            });
        });
        describe('Positive tests for fetchFirstToText:\n', function () {
            it('should return the index of the first driver available to text', function (){
                var testArrayDriverObjects = [
                                                {
                                                    firstName: 'David',
                                                    lastName: 'Moody',
                                                    mobilePhone: '479-899-1902',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 13,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'Al',
                                                    lastName: 'Yanik',
                                                    mobilePhone: '479-366-0454',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 14,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'Larie',
                                                    lastName: 'Craig',
                                                    mobilePhone: '479-301-5955',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: false,
                                                    scheduleNote: [],
                                                    seniorityRank: 15,
                                                    available: true
                                                },
                                                {
                                                    firstName: 'David',
                                                    lastName: 'Phillips',
                                                    mobilePhone: '479-621-1464',
                                                    deleted: false,
                                                    text: true,
                                                    firstToText: true,
                                                    scheduleNote: [],
                                                    seniorityRank: 16,
                                                    available: true
                                                }


                ];
                var indexOfFirstToText = driverServices.fetchFirstToText(testArrayDriverObjects);
                expect(indexOfFirstToText).to.be.an.integer;
                expect(indexOfFirstToText).to.equal(3);
                expect(testArrayDriverObjects[indexOfFirstToText].firstName).to.equal('David');
                expect(testArrayDriverObjects[indexOfFirstToText].lastName).to.equal('Phillips');
                expect(testArrayDriverObjects[indexOfFirstToText].firstToText).to.equal(true);
            });
            it('should return the index of the first driver available to text using database data', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (results){
                        var testArrayDriverObjects = results;
                        var indexOfFirstToText = driverServices.fetchFirstToText();

                        expect(indexOfFirstToText).to.be.an.integer;
                        expect(indexOfFirstToText).to.equal(0);
                        expect(testArrayDriverObjects[indexOfFirstToText].firstName).to.equal('Jim');
                        expect(testArrayDriverObjects[indexOfFirstToText].lastName).to.equal('Westphal');
                        expect(testArrayDriverObjects[indexOfFirstToText].firstToText).to.equal(true);
                    });
            });
        });
    });
    describe ('setNextFirstToText validation tests:\n', function (){
        describe ('Negative tests for setNextFirstToText:\n', function () {
            it('should print an error to the console, set numDrivers equal to number of available drivers, and\n' +
                'return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to maxIndex, drivers to text originally is 20', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var numDrivers = 20;
                        var maxIndex = results.length - 1;

                        // set firstToText to maxIndex, capture starting index just set, get updated drivers array, get newFirstToTextIndex
                        var driverCurIndexIsMaxIndexArray = driverServices.manualSetFirstToText(results, maxIndex);
                        var startingIndex = driverServices.getFirstToTextIndex(driverCurIndexIsMaxIndexArray);
                        var updatedDrivers = driverServices.setNextFirstToText(driverCurIndexIsMaxIndexArray, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);

                        expect(startingIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(15);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Gary');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Holtgrewe');
                        expect(updatedDrivers[startingIndex].firstToText).to.equal(true);
                    });

            });
            it('should print an error to the console, set numDrivers equal to number of available drivers, and\n' +
                'return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to maxIndex, drivers to text originally is 0', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var numDrivers = 0;
                        var maxIndex = results.length - 1;

                        // set firstToText to maxIndex, capture starting index just set, get updated drivers array, get newFirstToTextIndex
                        var driverCurIndexIsMaxIndexArray = driverServices.manualSetFirstToText(results, maxIndex);
                        var startingIndex = driverServices.getFirstToTextIndex(driverCurIndexIsMaxIndexArray);
                        var updatedDrivers = driverServices.setNextFirstToText(driverCurIndexIsMaxIndexArray, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);

                        expect(startingIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(15);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Gary');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Holtgrewe');
                        expect(updatedDrivers[startingIndex].firstToText).to.equal(true);
                    });

            });
        });
        describe ('Positive tests for setNextFirstToText:\n', function () {
            it('should return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current and next index less than max array index value', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var numDrivers = 5;
                        var updatedDrivers = driverServices.setNextFirstToText(results, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(results);

                        expect(updatedDrivers).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(5);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Barbara');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Clary');
                        expect(updatedDrivers[0].firstToText).to.equal(false);
                    });
            });
            it('should return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to max array index value, drivers to text is 1', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var numDrivers = 1;
                        var maxIndex = results.length - 1;


                        var driverCurIndexIsMaxIndexArray = driverServices.manualSetFirstToText(results, maxIndex);
                        var startingIndex = driverServices.getFirstToTextIndex(driverCurIndexIsMaxIndexArray);
                        var updatedDrivers = driverServices.setNextFirstToText(driverCurIndexIsMaxIndexArray, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);


                        expect(startingIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(0);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Jim');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Westphal');
                        expect(updatedDrivers[startingIndex].firstToText).to.equal(false);

                    });
            });
            it('should return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to max array index value, drivers to text is 4', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var numDrivers = 4;
                        var maxIndex = results.length - 1;

                        var driverCurIndexIsMaxIndexArray = driverServices.manualSetFirstToText(results, maxIndex);
                        var startingIndex = driverServices.getFirstToTextIndex(driverCurIndexIsMaxIndexArray);
                        var updatedDrivers = driverServices.setNextFirstToText(driverCurIndexIsMaxIndexArray, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);

                        expect(startingIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(3);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Perry');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Johnson');
                        expect(updatedDrivers[startingIndex].firstToText).to.equal(false);
                    });

            });
            it('should return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to max array index value, drivers to text is maxArray value', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var maxIndex = results.length - 1;
                        var numDrivers = maxIndex;

                        var driverCurIndexIsMaxIndexArray = driverServices.manualSetFirstToText(results, maxIndex);
                        var startingIndex = driverServices.getFirstToTextIndex(driverCurIndexIsMaxIndexArray);
                        var updatedDrivers = driverServices.setNextFirstToText(driverCurIndexIsMaxIndexArray, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);

                        expect(startingIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(maxIndex-1);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Dean');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Mangum');
                        expect(updatedDrivers[startingIndex].firstToText).to.equal(false);

                    });
            });
            it('should return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to max array index value, drivers to text is arraylength', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var maxIndex = results.length - 1;
                        var numDrivers = results.length;

                        var driverCurIndexIsMaxIndexArray = driverServices.manualSetFirstToText(results, maxIndex);
                        var startingIndex = driverServices.getFirstToTextIndex(driverCurIndexIsMaxIndexArray);
                        var updatedDrivers = driverServices.setNextFirstToText(driverCurIndexIsMaxIndexArray, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);

                        expect(startingIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(maxIndex);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Gary');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Holtgrewe');
                        expect(updatedDrivers[startingIndex].firstToText).to.equal(true);

                    });
            });
            it('should return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to 0, drivers to text is arraylength', function (){
                return driverServices.fetchAllDrivers()
                    .then(function (onlyAvailableDrivers){
                        return driverServices.fetchAllDriversByRankAvailableText();
                    }).then(function (results){
                        var numDrivers = results.length;

                        var startingIndex = driverServices.getFirstToTextIndex(results);
                        var updatedDrivers = driverServices.setNextFirstToText(results, numDrivers);
                        var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);

                        expect(startingIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.not.throw.error;
                        expect(newFirstToTextIndex).to.equal(startingIndex);
                        expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Jim');
                        expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Westphal');
                        expect(updatedDrivers[startingIndex].firstToText).to.equal(true);
                    });
            });
            it('should return drivers for Trip array with firstToText set to true for next driver\n' +
                    'using database data and current index equal to 4, drivers to text is arraylength', function (){
                        return driverServices.fetchAllDrivers()
                            .then(function (onlyAvailableDrivers){
                                return driverServices.fetchAllDriversByRankAvailableText();
                            }).then(function (results){
                                var curIndex = 6;
                                var numDrivers = results.length;

                                var driverCurIndexIsMaxIndexArray = driverServices.manualSetFirstToText(results, curIndex);
                                var startingIndex = driverServices.getFirstToTextIndex(driverCurIndexIsMaxIndexArray);
                                var updatedDrivers = driverServices.setNextFirstToText(driverCurIndexIsMaxIndexArray, numDrivers);
                                var newFirstToTextIndex = driverServices.getFirstToTextIndex(updatedDrivers);

                                expect(startingIndex).to.not.throw.error;
                                expect(newFirstToTextIndex).to.not.throw.error;
                                expect(newFirstToTextIndex).to.equal(curIndex);
                                expect(updatedDrivers[newFirstToTextIndex].firstName).to.equal('Marjorie');
                                expect(updatedDrivers[newFirstToTextIndex].lastName).to.equal('Smith');
                                expect(updatedDrivers[startingIndex].firstToText).to.equal(true);

                            });
            });

            it('should return array of current trip\'s driver with firstToText set for next driver', function(){
                var testDrivers = [
                                    {
                                    	"firstName" : "Jim",
                                    	"lastName" : "Westphal",
                                    	"mobilePhone" : "479-936-4608",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : true,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 1,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Tom",
                                    	"lastName" : "Nolan",
                                    	"mobilePhone" : "479-599-8090",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 2,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Mike",
                                    	"lastName" : "Thompson",
                                    	"mobilePhone" : "479-799-5151",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 3,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Perry",
                                    	"lastName" : "Johnson",
                                    	"mobilePhone" : "913-707-8379",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 4,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "John",
                                    	"lastName" : "Wyckoff",
                                    	"mobilePhone" : "316-655-3096",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 5,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Bob",
                                    	"lastName" : "Olson",
                                    	"mobilePhone" : "479-802-8744",
                                    	"deleted" : false,
                                    	"text" : false,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [],
                                    	"seniorityRank" : 6,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Barbara",
                                    	"lastName" : "Clary",
                                    	"mobilePhone" : "479-531-7403",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 7,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Jerry",
                                    	"lastName" : "Slyter",
                                    	"mobilePhone" : "479-640-1029",
                                    	"deleted" : false,
                                    	"text" : false,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 8,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Marjorie",
                                    	"lastName" : "Smith",
                                    	"mobilePhone" : "479-644-6509",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 9,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Don",
                                    	"lastName" : "Lawson",
                                    	"mobilePhone" : "479-586-2209",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 10,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "John",
                                    	"lastName" : "Smith",
                                    	"mobilePhone" : "479-644-6292",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 11,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Bill",
                                    	"lastName" : "Pippin",
                                    	"mobilePhone" : "479-282-5395",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 12,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "David",
                                    	"lastName" : "Moody",
                                    	"mobilePhone" : "479-899-1902",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 13,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Al",
                                    	"lastName" : "Yanik",
                                    	"mobilePhone" : "479-366-0454",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 14,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Larie",
                                    	"lastName" : "Craig",
                                    	"mobilePhone" : "479-301-5955",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 15,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "David",
                                    	"lastName" : "Phillips",
                                    	"mobilePhone" : "479-621-1464",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 16,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Dean",
                                    	"lastName" : "Mangum",
                                    	"mobilePhone" : "501-772-2373",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 17,
                                    	"available" : true
                                    },
                                    {
                                    	"firstName" : "Gary",
                                    	"lastName" : "Holtgrewe",
                                    	"mobilePhone" : "479-663-1032",
                                    	"deleted" : false,
                                    	"text" : true,
                                    	"firstToText" : false,
                                    	"scheduleNote" : [ ],
                                    	"seniorityRank" : 18,
                                    	"available" : true
                                    }
                                ];
                    var numDrivers = 5;
                    var results = driverServices.setNextFirstToText(testDrivers, numDrivers);
                    var newFirstToTextIndex = driverServices.getFirstToTextIndex(results);
                    expect(newFirstToTextIndex).to.equal(5);
                    expect(results[newFirstToTextIndex].firstName).to.equal('Bob');
                    expect(results[newFirstToTextIndex].lastName).to.equal('Olson');
                    expect(results[0].firstToText).to.equal(false);
            });
        });
    });
    describe('fetchAllDriversWhoText validation tests:\n', function (){
        describe ('Negative tests for fetchAllDriversWhoText:\n', function () {
        });
        describe ('Positive tests for fetchAllDriversWhoText:\n', function () {
            it ('should return all drivers who have text capability set to true', function () {
                var textDrivers = driverServices.fetchAllDriversWhoText();
                expect(textDrivers).to.be.an.array;
                expect(textDrivers).to.include.an.object;

                for (var i = 0; i < textDrivers.length; i++) {
                    expect(textDrivers[i]).to.have.deep.property('text', true);
                    expect(textDrivers[i]).to.not.have.deep.property('text', false);
                }
            });
        });
    });
    describe ('fetchAllDriversNoText validation tests:\n', function (){
        describe ('Negative tests for fetchAllDriversNoText:\n', function () {
        });
        describe('Positive tests for fetchAllDriversNoText:\n', function () {
            it('should return only drivers who have no text capability (text : false)', function(){
                var noTextDrivers = driverServices.fetchAllDriversNoText();
                expect(noTextDrivers).to.be.an.array;
                expect(noTextDrivers).to.include.an.object;
                for (var i = 0; i < noTextDrivers.length; i++) {
                    expect(noTextDrivers[i]).to.have.deep.property('text', false);
                    expect(noTextDrivers[i]).to.not.have.deep.property('text', true);
                }
            });
        });
    });
    describe ('updateOneDriverById validation tests:\n', function (){
        describe ('Negative tests for updateOneDriverById:\n', function () {
            it('should not update scheduleNote if the current value is null and the to update value is null', function (){
                var driverToUpdate =  {
                                        "_id" : '58e14af183fa6356879d7f0d',
                                        "__v" : 0,
                                        "firstName" : "Perry",
                                        "lastName" : "Johnson",
                                        "mobilePhone" : "913-707-8379",
                                        "deleted" : false,
                                        "text" : false,
                                        "firstToText" : false,
                                        "scheduleNote" : [ ],
                                        "seniorityRank" : 4,
                                        "available" : false
                                    };
                return driverServices.updateOneDriverById(driverToUpdate)
                    .then(function () {
                        return driverServices.fetchDriverByID(driverToUpdate._id)
                        .then(function (results) {
                            expect(results).to.exist;
                            expect(results).to.be.an.object;
                            expect(results.firstName).to.equal('Perry');
                            expect(results.lastName).to.equal('Johnson');
                            expect(results.mobilePhone).to.equal('913-707-8379');
                            expect(results.deleted).to.be.false;
                            expect(results.text).to.be.false;
                            expect(results.firstToText).to.be.false;
                            expect(results.scheduleNote).to.exist;
                            expect(results.scheduleNote.note).to.not.exist;
                            expect(results.seniorityRank).to.equal(4);
                            expect(results.available).to.be.false;

                            // reset to expected values so other tests don't fail
                            driverToUpdate =  {
                                                    "_id": "58e14af183fa6356879d7f0d",
                                                    "text": true,
                                                    "available": true
                                              };

                            return driverServices.updateOneDriverById(driverToUpdate)
                                .then(function () {
                                    return driverServices.fetchDriverByID(driverToUpdate._id)
                                        .then(function (results) {
                                            expect(results.text).to.equal(true);
                                            expect(results.available).to.equal(true);
                                        });
                                });

                        });

                    });
            });
            it('should not update the note if there are no changes to the note', function (){
                var oneDriver = {
                                	"_id" :"58e14af183fa6356879d7f17",
                                	"__v" : 0,
                                	"firstName" : "Al",
                                	"lastName" : "Yanik",
                                	"mobilePhone" : "479-366-0454",
                                	"deleted" : false,
                                	"text" : true,
                                	"firstToText" : false,
                                	"scheduleNote" : [{ note : 'Test Note for Al!' } ],
                                	"seniorityRank" : 14,
                                	"available" : true
                                };
                return driverServices.updateOneDriverById(oneDriver)
                    .then(function () {
                        return driverServices.fetchDriverByID(oneDriver._id)
                        .then(function (results) {
                            expect(results).to.exist;
                            expect(results).to.be.an.object;
                            expect(results._id.toString()).to.equal('58e14af183fa6356879d7f17');
                            expect(results.firstName).to.equal('Al');
                            expect(results.lastName).to.equal('Yanik');
                            expect(results.mobilePhone).to.equal('479-366-0454');
                            expect(results.deleted).to.be.false;
                            expect(results.text).to.be.true;
                            expect(results.firstToText).to.be.false;
                            expect(results.scheduleNote).to.exist;
                            expect(results.scheduleNote[0].note).to.equal('Test Note for Al!');
                            expect(results.seniorityRank).to.equal(14);
                            expect(results.available).to.be.true;
                        });
                    });
            });
        });
        describe.skip ('Positive tests for updateOneDriverById:\n', function () {
            it('should update an existing driver to match the given parameters', function() {
                var driverToUpdate =  {
                                            "_id": "58e14af183fa6356879d7f0b",
                                            "__v": 0,
                                            "firstName": "Tom",
                                            "lastName": "Nolan",
                                            "mobilePhone": "479-599-8090",
                                            "deleted": false,
                                            "text": false,
                                            "firstToText": false,
                                            "scheduleNote": [{ note: 'Test Note #1 for Tom!'}],
                                            "seniorityRank": 2,
                                            "available": false
                                        };

                return driverServices.updateOneDriverById(driverToUpdate)
                    .then(function () {

                        return driverServices.fetchDriverByID(driverToUpdate._id)
                        .then(function (results) {
                            expect(results).to.exist;
                            expect(results).to.be.an.object;
                            expect(results.firstName).to.equal('Tom');
                            expect(results.lastName).to.equal('Nolan');
                            expect(results.mobilePhone).to.equal('479-599-8090');
                            expect(results.deleted).to.be.false;
                            expect(results.text).to.be.false;
                            expect(results.firstToText).to.be.false;
                            expect(results.scheduleNote).to.exist;
                            expect(results.scheduleNote[0].note).to.equal('Test Note #1 for Tom!');
                            expect(results.seniorityRank).to.equal(2);
                            expect(results.available).to.be.false;
                            // reset to expected values for other tests:
                            driverToUpdate =  {
                                                    "_id": "58e14af183fa6356879d7f0b",
                                                    "text": true,
                                                    "available": true
                                                };

                            return driverServices.updateOneDriverById(driverToUpdate)
                                .then(function () {
                                    return driverServices.fetchDriverByID(driverToUpdate._id)
                                    .then(function (results) {
                                        expect(results).to.exist;
                                        expect(results).to.be.an.object;
                                        expect(results.available).to.equal(true);
                                        expect(results.text).to.equal(true);
                                    });
                                });

                        });
                    });
            });
            it('should only add a schedule note', function() {
                var oneDriver = {
                                	"_id" :"58e14af183fa6356879d7f17",
                                	"__v" : 0,
                                	"firstName" : "Al",
                                	"lastName" : "Yanik",
                                	"mobilePhone" : "479-366-0454",
                                	"deleted" : false,
                                	"text" : true,
                                	"firstToText" : false,
                                	"scheduleNote" : [{ note : 'Test Note for Al!' } ],
                                	"seniorityRank" : 14,
                                	"available" : true
                                };
                return driverServices.updateOneDriverById(oneDriver)
                    .then(function () {
                        return driverServices.fetchDriverByID(oneDriver._id)
                        .then(function (results) {
                            expect(results).to.exist;
                            expect(results).to.be.an.object;
                            expect(results._id.toString()).to.equal('58e14af183fa6356879d7f17');
                            expect(results.firstName).to.equal('Al');
                            expect(results.lastName).to.equal('Yanik');
                            expect(results.mobilePhone).to.equal('479-366-0454');
                            expect(results.deleted).to.be.false;
                            expect(results.text).to.be.true;
                            expect(results.firstToText).to.be.false;
                            expect(results.scheduleNote).to.exist;
                            expect(results.scheduleNote[0].note).to.equal('Test Note for Al!');
                            expect(results.seniorityRank).to.equal(14);
                            expect(results.available).to.be.true;
                        });
                    });
            });
            it('should update scheduleNote with a blank note if a previous note exists', function() {
                var driverToUpdate =  {
                                            "_id": "58e14af183fa6356879d7f0b",
                                            scheduleNote: []
                                     }
                return driverServices.updateOneDriverById(driverToUpdate)
                    .then(function () {
                        return driverServices.fetchDriverByID(driverToUpdate._id)
                        .then(function (results) {
                            expect(results).to.exist;
                            expect(results).to.be.an.object;
                            expect(results.firstName).to.equal('Tom');
                            expect(results.lastName).to.equal('Nolan');
                            expect(results.scheduleNote.length).to.equal(0);
                        });
                    });
            });
        });
    });
    describe ('setScheduleNoteForDisplay validation tests:\n', function (){
        describe ('Negative tests for setScheduleNoteForDisplay:\n', function () {
        });
        describe ('Positive tests for setScheduleNoteForDisplay:\n', function () {
            it ('should have only one note for dispaly if a driver has multiple notes', function(done){
                var testDrivers = [{
                                        "firstName" : "Larie",
                                        "lastName" : "Craig",
                                        "mobilePhone" : "479-301-5955",
                                        "deleted" : false,
                                        "text" : true,
                                        "firstToText" : false,
                                        "scheduleNote" : [ ],
                                        "seniorityRank" : 15,
                                        "available" : true
                                    },
                                    {
                                        "firstName" : "David",
                                        "lastName" : "Phillips",
                                        "mobilePhone" : "479-621-1464",
                                        "deleted" : false,
                                        "text" : true,
                                        "firstToText" : false,
                                        "scheduleNote" : [{note:'Whatever'}],
                                        "seniorityRank" : 16,
                                        "available" : true
                                    },
                                    {
                                        "firstName" : "Dean",
                                        "lastName" : "Mangum",
                                        "mobilePhone" : "501-772-2373",
                                        "deleted" : false,
                                        "text" : true,
                                        "firstToText" : false,
                                        "scheduleNote" : [{note: 1}, {note: 2}, {note : 3}],
                                        "seniorityRank" : 17,
                                        "available" : true
                                    },
                                    {
                                        "firstName" : "Gary",
                                        "lastName" : "Holtgrewe",
                                        "mobilePhone" : "479-663-1032",
                                        "deleted" : false,
                                        "text" : true,
                                        "firstToText" : false,
                                        "scheduleNote" : [ ],
                                        "seniorityRank" : 18,
                                        "available" : true
                                    }
                                ];
                var finalDrivers = driverServices.setScheduleNoteForDisplay(testDrivers);
                expect(finalDrivers[1].scheduleNote[0].note).to.equal('Whatever');
                expect(finalDrivers[2].scheduleNote[0].note).to.equal(3);

                done();
            });
        });
    });

    describe ('updateManyDrivers validation tests:\n', function (){
        describe ('Negative tests for updateManyDrivers:\n', function () {

        });
        describe.only ('Positive tests for updateManyDrivers:\n', function () {
            it ('should update several drivers via calling the updateOneDriverById', function (){
                // simulate receiving info back from the drivers' tab web form
                var driversFromWeb = [
                                        {
                                            "_id" : "58e14af183fa6356879d7f0a",
                                            "__v" : 0,
                                            "firstName" : "Jim",
                                            "lastName" : "Westphal",
                                            "mobilePhone" : "479-936-4608",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 1,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f0b",
                                            "__v" : 37,
                                            "firstName" : "Tom",
                                            "lastName" : "Nolan",
                                            "mobilePhone" : "479-599-8090",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 2,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f0c",
                                            "__v" : 0,
                                            "firstName" : "Mike",
                                            "lastName" : "Thompson",
                                            "mobilePhone" : "479-799-5151",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 3,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f0d",
                                            "__v" : 9,
                                            "firstName" : "Perry",
                                            "lastName" : "Johnson",
                                            "mobilePhone" : "913-707-8379",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 4,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f0e",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Wyckoff",
                                            "mobilePhone" : "316-655-3096",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 5,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f0f",
                                            "__v" : 0,
                                            "firstName" : "Bob",
                                            "lastName" : "Olson",
                                            "mobilePhone" : "479-802-8744",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 6,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f10",
                                            "__v" : 0,
                                            "firstName" : "Barbara",
                                            "lastName" : "Clary",
                                            "mobilePhone" : "479-531-7403",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 7,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f11",
                                            "__v" : 0,
                                            "firstName" : "Jerry",
                                            "lastName" : "Slyter",
                                            "mobilePhone" : "479-640-1029",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 8,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f12",
                                            "__v" : 0,
                                            "firstName" : "Marjorie",
                                            "lastName" : "Smith",
                                            "mobilePhone" : "479-644-6509",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 9,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f13",
                                            "__v" : 0,
                                            "firstName" : "Don",
                                            "lastName" : "Lawson",
                                            "mobilePhone" : "479-586-2209",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 10,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f14",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Smith",
                                            "mobilePhone" : "479-644-6292",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 11,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f15",
                                            "__v" : 0,
                                            "firstName" : "Bill",
                                            "lastName" : "Pippin",
                                            "mobilePhone" : "479-282-5395",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 12,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f16",
                                            "__v" : 0,
                                            "firstName" : "David",
                                            "lastName" : "Moody",
                                            "mobilePhone" : "479-899-1902",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 13,
                                            "available" : true
                                        },
                                            {
                                            "_id" : "58e14af183fa6356879d7f17",
                                            "__v" : 4,
                                            "firstName" : "Al",
                                            "lastName" : "Yanik",
                                            "mobilePhone" : "479-366-0454",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [
                                                                {
                                                                    "note" : "Test Note for Al!",
                                                                    "_id" : "58e1aa79e32b5f730d3e5743",
                                                                    "createDate" : "2017-04-03T01:50:49.135Z"
                                                                }
                                                             ],
                                            "seniorityRank" : 14,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f18",
                                            "__v" : 0,
                                            "firstName" : "Larie",
                                            "lastName" : "Craig",
                                            "mobilePhone" : "479-301-5955",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 15,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f19",
                                            "__v" : 0,
                                            "firstName" : "David",
                                            "lastName" : "Phillips",
                                            "mobilePhone" : "479-621-1464",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 16,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f1a",
                                            "__v" : 0,
                                            "firstName" : "Dean",
                                            "lastName" : "Mangum",
                                            "mobilePhone" : "501-772-2373",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 17,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58e14af183fa6356879d7f1b",
                                            "__v" : 0,
                                            "firstName" : "Gary",
                                            "lastName" : "Holtgrewe",
                                            "mobilePhone" : "479-663-1032",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 18,
                                            "available" : true
                                        }
                                    ];

                    driverServices.updateManyDrivers(driversFromWeb);
                        return driverServices.fetchAllDrivers()
                            .then(function (results) {
                                var lastIndex = results.length - 1;
                                for (var i = 0; i < lastIndex; i++) {
                                    if (i !== (lastIndex)){
                                        expect(results[i].firstToText).to.equal(false);
                                    } else {
                                        expect(results[i].firstToText).equal(true);
                                    }
                                }
                                //reset firstToText for other tests:
                                var resetDrivers = driverServices.manualSetFirstToText(results, 0);
                                expect(resetDrivers[0].firstToText).to.equal(true);
                                expect(resetDrivers[lastIndex].firstToText).to.equal(false);
                            });


            });

        });
    });

    describe ('deleteDriverbyId validation tests:\n', function (){
        describe ('Negative tests for deleteDriverbyId:\n', function () {
        });
        describe ('Positive tests for deleteDriverbyId:\n', function () {

        });
    });
    describe ('Convert All Drivers Object ID to Strings validation tests:\n', function (){
        describe ('Negative tests for AllObjectIdToString:\n', function () {
        });
        describe ('Positive tests for AllObjectIdToString:\n', function () {
            it ('should pass with a string representation of ObjectId\n', function () {
                return driverServices.fetchAllDrivers()
                    .then(function (drivers) {
                        var withObjectIdAsString = driverServices.allObjectIdToString(drivers);

                        for (var i = 0; i < withObjectIdAsString.length; i++) {
                            expect(withObjectIdAsString[i].stringObjectId).to.be.a('string');
                        }
                    });
            });
        });
    });


});
