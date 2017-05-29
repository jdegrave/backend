var chai = require('chai');
var expect = chai.expect;
var assertInteger = require('chai-integer');
var chaiDateTime = require('chai-datetime');
var assertArrays = require('chai-arrays');
var moment = require('moment');
var sinon = require('sinon');
var twilio = require('twilio');


chai.use(assertArrays);
chai.use(chaiDateTime);
chai.use(assertArrays);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Driver = require('../models/driver.model');
var driverServices = require('../services/driver.services');
var Location = require('../models/location.model');
var locationServices = require('../services/location.services');
var Trip = require('../models/trip.model');
var tripServices = require('../services/trip.services');

describe.skip ('Trip Services Validation Tests:\n', function () {
    describe('Pre Trip Function Validation Tests:\n', function () {
        describe('Negative Tests for preTrip function:\n', function () {

        });
        describe('Positive Tests for preTrip function:\n', function ()  {
            it('should pass if locations come back successfully', function () {
                return tripServices.preTrip()
                    .then(function (results){
                        expect(results).to.be.array;

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
    describe('Get Locations Function Validation Tests:\n', function () {
        describe('Negative Tests for getLocations function:\n', function () {

        });
        describe('Positive Tests for getLocations function:\n', function ()  {
            it('should pass if locations come back successfully', function () {
                return tripServices.preTrip()
                    .then(function (results) {
                        expect(results).to.be.array;
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
    describe('Get Available Drivers Function Validation Tests:\n', function () {
        describe('Negative Tests for getAvailableDrivers function:\n', function () {

        });
        describe('Positive Tests for getAvailableDrivers function:\n', function ()  {
            it('should pass if all drivers with text = true and available = true return', function () {
                return tripServices.getAvailableDrivers()
                    .then(function (results){
                        expect(results).to.be.array;
                        expect(results.length).to.equal(16);
                    });
            });
        });
    });
    describe('Get Location By Trip ID Validation Tests:\n', function () {
        describe('Negative Tests for fetchTripLocationById function:\n', function () {

        });
        describe('Positive Tests for fetchTripLocationById function:\n', function ()  {
            it('it should pass if a valid tripId is passed', function () {
                var tripId = '58eae04885db18addc415faf'
                return tripServices.fetchTripLocationById(tripId)
                    .then(function (results){
                        expect(results).to.be.an.object;
                        expect(results._id.toString()).to.be.a('string');
                        expect(results.cityCode.cityCode).to.equal('JP6');
                        expect(results.status).to.equal('BLANK');
                        expect(results.responseDeadline.toString()).to.equal('Mon May 01 2017 13:00:00 GMT-0500 (CDT)');
                        expect(results.driverQuota).to.equal(7);
                        expect(results.messages).to.exist;
                        expect(results.messages.driverRequest).to.exist;
                        expect(results.messages.confirmationRejected).to.exist;
                        expect(results.messages.confirmationAccepted).to.exist;
                        expect(results.messages.driverRequest).to.equal('Will you accept a trip to JP6 (Joplin Downtown 7th St) MONDAY, 05-01-2017, at 13:30? Reply: 1=YES, 2=NO. Please respond by 13:00 TODAY.');
                        expect(results.messages.confirmationRejected).to.equal('DECLINED/REJECTED: JP6 MONDAY, 05-01-2017, at 13:30 trip. You are NOT ASSIGNED TO THIS TRIP. Driver quota met/response window has closed. Thank you.');
                        expect(results.messages.confirmationAccepted).to.equal('You are CONFIRMED for trip to JP6 MONDAY, 05-01-2017, at 13:30. If an issue arises, CALL (479) 795-8155.');
                        expect(results.responses).to.exist;
                        expect(results.responses.noResponse).to.exist;
                        expect(results.responses.declined).to.be.an.array;
                        expect(results.responses.yesRejected).to.be.an.array;
                        expect(results.responses.yesAccepted).to.be.an.array;
                        expect(results.availableDrivers.length).to.equal(18);
                        expect(results.tripStart.toString()).to.equal('Mon May 01 2017 13:30:00 GMT-0500 (CDT)')
                    });
            });
        });
    });
    describe('Create Trip Function Validation Tests:\n', function () {
        describe('Negative Tests for createTrip function:\n', function () {

        });
        describe('Positive Tests for createTrip function:\n', function ()  {
            it('should pass valid trip specs are passed', function () {
                var newTrip = {
                                    cityCode : 'JP6',
                                    driverQuota : '7',
                                    startDate: '217-05-01',
                                    startTime: '13:30'
                                };

                return tripServices.createTrip(newTrip)
                    .then (function (trip) {
                        expect(trip).to.exist;
                        return tripServices.fetchTripLocationById(trip._id)
                            .then(function (results) {

                                expect(results).to.be.an.object;
                                expect(results).to.contain.an.array;
                                expect(results._id).to.exist;
                                expect(results.cityCode.cityCode).to.equal('JP6');
                                expect(results.status).to.equal('BLANK');

                            });
                    });
            });
        });
    });
    describe('Create trip validateTripParams Validation Tests:\n', function () {
        describe('Negative Tests for validateTripParams function:\n', function () {
            describe('Negative Tests for cityCode validation:', function (){
                it('should fail with empty string as cityCode', function (done){
                    var tripStartTime = moment().add(3, 'hours');


                    var newTrip = {
                                        cityCode : '',
                                        driverQuota : 1,
                                        tripStartTime : tripStartTime
                                    };
                    var badCityCode = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);
                    console.log('badCityCode in test: ', badCityCode);
                    expect(badCityCode).to.be.an.object;
                    expect(badCityCode).to.be.an.instanceof(Array);
                    expect(badCityCode).to.have.lengthOf(1);
                    expect(badCityCode[0]).to.be.an.instanceof(Error);
                    expect(badCityCode[0]).to.have.ownProperty('cityCodeError');
                    expect(badCityCode[0].cityCodeError.message).to.equal('Invalid city code.');

                    done();
                });
                it('should fail with cityCode value of null', function (done){
                    var tripStartTime = moment().add(3, 'hours');


                    var newTrip = {
                                        cityCode : null,
                                        driverQuota : 1,
                                        tripStartTime : tripStartTime
                                    };
                    var badCityCode = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);
                    expect(badCityCode).to.be.an.object;
                    expect(badCityCode).to.be.an.instanceof(Array);
                    expect(badCityCode).to.have.lengthOf(1);
                    expect(badCityCode[0]).to.be.an.instanceof(Error);
                    expect(badCityCode[0]).to.have.ownProperty('cityCodeError');
                    expect(badCityCode[0].cityCodeError.message).to.equal('Invalid city code.');

                    done();
                });
                it('should fail with cityCode value of undefined', function (done){
                    var tripStartTime = moment().add(3, 'hours');


                    var newTrip = {
                                        cityCode : undefined,
                                        driverQuota : 1,
                                        tripStartTime : tripStartTime
                                    };
                    var badCityCode = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);
                    expect(badCityCode).to.be.an.object;
                    expect(badCityCode).to.be.an.instanceof(Array);
                    expect(badCityCode).to.have.lengthOf(1);
                    expect(badCityCode[0]).to.be.an.instanceof(Error);
                    expect(badCityCode[0]).to.have.ownProperty('cityCodeError');
                    expect(badCityCode[0].cityCodeError.message).to.equal('Invalid city code.');

                    done();
                });
            });
            describe('Negative Tests for trip StartDate and Time validation:', function () {
                it('should fail it tripDateTime is set to now ', function (done) {
                    var tripStartTime = moment();

                    var newTrip = {
                                        cityCode : 'FSM',
                                        driverQuota : 3,
                                        tripStartTime : tripStartTime
                                    };

                    var badTime = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);

                    expect(badTime).to.be.an.object;
                    expect(badTime).to.be.an.instanceof(Array);
                    expect(badTime).to.have.lengthOf(1);
                    expect(badTime[0]).to.be.an.instanceof(Error);
                    expect(badTime[0]).to.have.ownProperty('tripDateError');
                    expect(badTime[0].tripDateError.message).to.equal('Invalid date and/or time. Or trip start is less than current date/time. Or trip start is less than 40 mintues from now.');

                    done();
                });
                it ('should fail it tripDateTime is equal to false ', function (done) {

                    var tripStartTime = false;

                    var newTrip = {
                                        cityCode : 'FSM',
                                        driverQuota : 3,
                                        tripStartTime : tripStartTime
                                    };

                    var badTime = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);

                    expect(badTime).to.be.an.object;
                    expect(badTime).to.be.an.instanceof(Array);
                    expect(badTime).to.have.lengthOf(1);
                    expect(badTime[0]).to.be.an.instanceof(Error);
                    expect(badTime[0]).to.have.ownProperty('tripDateError');
                    expect(badTime[0].tripDateError.message).to.equal('Invalid date and/or time. Or trip start is less than current date/time. Or trip start is less than 40 mintues from now.');

                    done();
                });
                it('should fail it tripDateTime is equal 38 minutes from now ', function (done) {
                    var tripStartTime = moment().add(38, 'minutes');

                    var newTrip = {
                                        cityCode : 'FSM',
                                        driverQuota : 3,
                                        tripStartTime : tripStartTime
                                    };

                    var badTime = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);

                    expect(badTime).to.be.an.object;
                    expect(badTime).to.be.an.instanceof(Array);
                    expect(badTime).to.have.lengthOf(1);
                    expect(badTime[0]).to.be.an.instanceof(Error);
                    expect(badTime[0]).to.have.ownProperty('tripDateError');
                    expect(badTime[0].tripDateError.message).to.equal('Invalid date and/or time. Or trip start is less than current date/time. Or trip start is less than 40 mintues from now.');

                    done();
                });
            });
            describe('Negative Tests for bad city Code and bad trip StartDate and Time validation:', function () {
                it('should fail when tripDateTime is set to now and cityCode is the empty string', function (done) {
                    var tripStartTime = moment();

                    var newTrip = {
                                        cityCode : '',
                                        driverQuota : 3,
                                        tripStartTime : tripStartTime
                                    };

                    var badTrip = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);

                    expect(badTrip).to.be.an.object;
                    expect(badTrip).to.be.an.instanceof(Array);
                    expect(badTrip).to.have.lengthOf(1);
                    expect(badTrip[0]).to.be.an.instanceof(Error);
                    expect(badTrip[0]).to.have.ownProperty('cityCodeError');
                    expect(badTrip[0]).to.have.ownProperty('tripDateError');
                    expect(badTrip[0].cityCodeError.message).to.equal('Invalid city code.');
                    expect(badTrip[0].tripDateError.message).to.equal('Invalid date and/or time. Or trip start is less than current date/time. Or trip start is less than 40 mintues from now.');

                    done();
                });
            });
            describe('Negative Tests for bad city Code, bad Driver Quota, and bad trip StartDate and Time validation:', function () {
                it('should fail when tripDateTime is set to now, driverQuota = 0, and cityCode is the empty string', function (done) {
                    var tripStartTime = moment();

                    var newTrip = {
                                        cityCode : '',
                                        driverQuota : 0,
                                        tripStartTime : tripStartTime
                                    };

                    var badTrip = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);
                    console.log('badTrip trifecta: ', badTrip);
                    expect(badTrip).to.be.an.object;
                    expect(badTrip).to.be.an.instanceof(Array);
                    expect(badTrip).to.have.lengthOf(1);
                    expect(badTrip[0]).to.be.an.instanceof(Error);
                    expect(badTrip[0]).to.have.ownProperty('cityCodeError');
                    expect(badTrip[0]).to.have.ownProperty('tripDateError');
                    expect(badTrip[0]).to.have.ownProperty('driverQuotaError');
                    expect(badTrip[0].cityCodeError.message).to.equal('Invalid city code.');
                    expect(badTrip[0].tripDateError.message).to.equal('Invalid date and/or time. Or trip start is less than current date/time. Or trip start is less than 40 mintues from now.');
                    expect(badTrip[0].driverQuotaError.message).to.equal('You must request at least 1 driver and have at least 1 driver available.');

                    done();
                });
            });
        });
        describe('Positive Tests for validateTripParams function:\n', function () {
            it('should pass if has an ObjectId and valid trip start time', function (done){
                var tripStartTime = moment().add(4, 'hours');

                var newTrip = {
                                cityCode : 'PLK',
                                driverQuota : 1,
                                tripStartTime : tripStartTime
                            };

                var results = tripServices.validateTripParams(newTrip.cityCode, newTrip.driverQuota, newTrip.tripStartTime);

                expect(results.length).to.equal(0);

                done();
            });
        });
    });
    describe('Create Trip Fetch Location ID Validation Tests:\n', function () {
        describe('Negative Tests for fetchLocationID function:\n', function () {

        });
        describe('Positive Tests for fetchLocationID function:\n', function () {
            it('should pass and return the ObjectId of the corresponding location object', function (){
                var curCityCode = 'TUL';

                return tripServices.fetchLocationID(curCityCode)
                    .then(function (results){
                        expect(results.toString()).to.equal('58d3f839936b0405bcda9bd8');
                    });
            });
        });
    });
    describe('Create Trip Start Date and Time Validation Tests:\n', function () {
        describe('Negative Tests for createTripDateTime function:\n', function () {

        });
        describe('Positive Tests for createTripDateTime function:\n', function ()  {
            it('should pass if date and time come back successfully', function (done) {
                var myDate = '2017-04-13';
                var myTime = '16:15';
                var dateTime = tripServices.createTripDateTime(myDate, myTime);

                // just test the time portion of the start date and time
                var justTime = moment(dateTime).format('HH:mm');

                expect(moment(dateTime).isValid()).to.be.true;
                expect(moment(dateTime).isSame(myDate, 'day')).to.equal(true);
                expect(justTime).to.equal(myTime);

                done();

            });
        });
    });
    describe('Fetch Trip by Trip ID Validation Tests:\n', function () {
        describe('Negative Tests for fetchTripById function:\n', function () {
            it('should fail with an invalid trip ID', function (){
                var tripId = '58eae04885db18addc4455faf';
                var error;
                return tripServices.fetchTripById(tripId)
                    .then(function (results){
                        expect.results.to.not.exist;
                    }).catch(function (err) {
                        expect(err).to.exist;
                        expect(err.message).to.exist;
                        expect(err.message).to.equal('Cast to ObjectId failed for value "58eae04885db18addc4455faf" at path "_id" for model "Trip"');
                    });
            });
        });
        describe('Positive Tests for fetchTripById function:\n', function () {
            it('should pass with a valid trip ID', function (){
                var tripId = '58eae04885db18addc415faf';

                return tripServices.fetchTripById(tripId)
                    .then(function (results){
                        expect(results._id.toString()).to.equal(tripId);
                        expect(results.cityCode).to.exist;
                        expect(results.cityCode.toString()).to.equal('58d3f839936b0405bcda9bdc');
                        expect(results.driverQuota).to.equal(7);
                    });

            });
        });
    });

    describe('Create Trip Response Deadline Validation Tests:\n', function () {
        describe('Negative Tests for createResponseDeadline function:\n', function () {

        });
        describe('Positive Tests for createResponseDeadline function:\n', function ()  {
            it('should pass if trip is for current date and 45 minutes from current time so that response deadline is  30 minutes less than tripStart', function (done) {
                var myDate = '2017-04-13';  // set to today's date
                var myTime = '16:30';      // set to at least 45 minutes after current time
                var dateTime = tripServices.createTripDateTime(myDate, myTime);

                var responseDeadline = tripServices.createResponseDeadline(myTime);
                var justStartTimeMinus30 = moment(dateTime).subtract(30, 'minutes').format('HH:mm');

                var justDeadlineTime = moment(responseDeadline).format('HH:mm');


                expect(moment(dateTime).isValid()).to.be.true;
                expect(moment(responseDeadline).isValid()).to.be.true;
                expect(moment().isSame(responseDeadline, 'day')).to.equal(true);
                expect(justStartTimeMinus30).to.equal(justDeadlineTime);

                done();

            });
            it('should pass if trip date is after today time should be number of available drivers * 4 minutes', function (done) {
                var myDate = '20170630';  // set to after today's date
                var myTime = '16:30';   // set to after current time for today's date
                var dateTime = tripServices.createTripDateTime(myDate, myTime);

                var responseDeadline = tripServices.createResponseDeadline(dateTime, myTime);

                // to test the time portion of the start date and time of tripStart and responseDeadline
                var availableDrivers = 20;
                var responseTime = availableDrivers * 4;  // 4 minutes is the time between rounds of text bursts
                                                          // set to worse case scenario, only need 1 driver needed so 18 drivers * 4 minutes = 73 minutes
                var justResponseTime = moment().add(responseTime, 'minutes').format('HH:mm');
                var justDeadlineTime = moment(responseDeadline).format('HH:mm');


                expect(moment(dateTime).isValid()).to.be.true;
                expect(moment(responseDeadline).isValid()).to.be.true;
                expect(moment().isSame(responseDeadline, 'day')).to.equal(true);
                expect(justResponseTime).to.equal(justDeadlineTime);

                done();

            });
        });
    });
    describe('Trip Driver Quota Check Validation Tests:\n', function () {
        describe('Negative Tests for checkDriverQuota function:\n', function () {
            it('should pass if drivers requested is greater than available drivers', function (){
                var driversRequested = 25;
                return tripServices.getAvailableDrivers()
                    .then(function (results) {
                        var myDrivers = tripServices.checkDriverQuota(driversRequested);
                        expect(myDrivers).to.equal(results.length);
                        expect(myDrivers).to.equal(16);
                    });
            });
        });
        describe('Positive Tests for checkDriverQuota function:\n', function ()  {
            it('should pass if checkDriverQuota is less than the available drivers', function () {
                var driversRequested = 5;
                return tripServices.getAvailableDrivers()
                    .then(function (results) {
                        var myDrivers = tripServices.checkDriverQuota(driversRequested);
                        expect(myDrivers).to.equal(driversRequested);
                        expect(myDrivers).to.equal(5);
                        expect(tripServices.adjustDriverQuota).to.equal(false);
                });
            });
            it('should pass if checkDriverQuota is equal to the available drivers', function (done) {
                var driversRequested = 16;
                var results = tripServices.checkDriverQuota(driversRequested);

                expect(results).to.equal(driversRequested);
                expect(tripServices.adjustDriverQuota).to.equal(false);

                done();
            });
        });
    });

    describe('Build Location Message Validation Tests:\n', function () {
        describe('Negative Tests for buildDriverRequestMessage function:\n', function () {
        });
        describe('Positive Tests for buildDriverRequestMessage function:\n', function () {
            it('should pass if PLK city code is passed (returns "PLK (Branson)"', function () {
                var cityCode = 'PLK'
                return tripServices.buildLocationMessage(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('PLK (Branson)');
                    });

            });
            it('should pass if LCL city code is passed (returns "LCL (Local)"', function () {
                var cityCode = 'LCL'
                return tripServices.buildLocationMessage(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('LCL (Local)');
                    });
            });
            it('should pass if JLN city code is passed (returns "JLN (Joplin Airport)"', function () {
                var cityCode = 'JLN'
                return tripServices.buildLocationMessage(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('JLN (Joplin Airport)');
                    });
            });
            it('should pass if JP6 city code is passed (returns "JP6 (Joplin Downtown 7th Street)"', function () {
                var cityCode = 'JP6'
                return tripServices.buildLocationMessage(cityCode)
                    .then(function (results) {
                        expect(results).to.equal('JP6 (Joplin Downtown 7th St)');
                    });
            });
         });
    });
    describe('Build Driver Request Message Validation Tests:\n', function () {
        describe('Negative Tests for buildDriverRequestMessage function:\n', function () {
        });
        describe('Positive Tests for buildDriverRequestMessage function:\n', function ()  {
            it('should pass if today\'s date and valid time are supplied', function (done) {
                var startDate = moment();
                var resDeadLine = moment(startDate).subtract(30, 'minutes');
                var tripLocation = 'TUL';

                var driverMessage = tripServices.buildDriverRequestMessage(startDate, resDeadLine, tripLocation);
                expect(driverMessage).to.exist;


                done();
            });
            it('should pass if tomorrow\'s date and valid time are supplied', function (done) {
                var startDate = moment().add(1, 'day');
                var resDeadLine = moment(startDate).subtract(30, 'minutes');
                var tripLocation = 'JLN';

                var driverMessage = tripServices.buildDriverRequestMessage(startDate, resDeadLine, tripLocation);
                expect(driverMessage).to.exist;


                done();
            });
            it('should pass if a future date beyond tomorrow and valid time are supplied', function (done) {
                var startDate = moment().add(3, 'day');
                var resDeadLine = moment(startDate).subtract(30, 'minutes');
                var tripLocation = 'FSM';

                var driverMessage = tripServices.buildDriverRequestMessage(startDate, resDeadLine, tripLocation);
                expect(driverMessage).to.exist;

                done();
            });
        });
    });
    describe('Build Accepted Confirmation Message Validation Tests:\n', function () {
        describe('Negative Tests for buildAcceptedConfirmationMessage function:\n', function () {

        });
        describe('Positive Tests for buildAcceptedConfirmationMessage function:\n', function ()  {
            it('should pass if city and tripStart time are supplied', function (done) {
                var startDate = moment();
                var tripLocation = 'TUL';

                var acceptedConfirmationMesssage = tripServices.buildAcceptedConfirmationMessage(startDate, tripLocation);
                expect(acceptedConfirmationMesssage).to.exist;

                done();
            });
            it('should pass if tomorrow\'s date and valid time are supplied', function (done) {
                var startDate = moment().add(1, 'day');
                var tripLocation = 'JLN';

                var acceptedConfirmationMesssage = tripServices.buildAcceptedConfirmationMessage(startDate, tripLocation);
                expect(acceptedConfirmationMesssage).to.exist;

                done();
            });
            it('should pass if a future date beyond tomorrow and valid time are supplied', function (done) {
                var startDate = moment().add(3, 'day');
                var tripLocation = 'FSM';

                var acceptedConfirmationMesssage = tripServices.buildAcceptedConfirmationMessage(startDate, tripLocation);
                expect(acceptedConfirmationMesssage).to.exist;

                done();
            });
        });
    });
    describe('Build Rejected Confirmation Message Validation Tests:\n', function () {
        describe('Negative Tests for buildRejectedConfirmationMessage function:\n', function () {

        });
        describe('Positive Tests for buildRejectedConfirmationMessage function:\n', function ()  {
            it('should pass if city and tripStart time are supplied', function (done) {
                var startDate = moment();
                var tripLocation = 'TUL';

                var rejectedConfirmationMesssage = tripServices.buildRejectedConfirmationMessage(startDate, tripLocation);
                expect(rejectedConfirmationMesssage).to.exist;


                done();
            });
            it('should pass if tomorrow\'s date and valid time are supplied', function (done) {
                var startDate = moment().add(1, 'day');
                var tripLocation = 'JLN';

                var rejectedConfirmationMesssage = tripServices.buildRejectedConfirmationMessage(startDate, tripLocation);
                expect(rejectedConfirmationMesssage).to.exist;

                done();
            });
            it('should pass if a future date beyond tomorrow and valid time are supplied', function (done) {
                var startDate = moment().add(3, 'day');
                var tripLocation = 'FSM';

                var rejectedConfirmationMesssage = tripServices.buildRejectedConfirmationMessage(startDate, tripLocation);
                expect(rejectedConfirmationMesssage).to.exist;

                done();
            });
        });
    });
    describe('Add No Response Drivers Tests:\n', function () {
        describe('Negative Tests for addNoResponseDriver function:\n', function () {

        });
        describe('Positive Tests for addNoResponseDriver function:\n', function ()  {
            it('should pass by assigning no response drivers to noResponse array in trips', function () {
                var noResponseDrivers = [
                                            '58d3f839936b0405bcda9bc6',
                                            '58d3f839936b0405bcda9bc7',
                                            '58d3f839936b0405bcda9bc8',
                                            '58d3f839936b0405bcda9bc9',
                                            '58d3f839936b0405bcda9bca',
                                            '58d3f839936b0405bcda9bcc',
                                            '58d3f839936b0405bcda9bce',
                                            '58d3f839936b0405bcda9bcf',
                                            '58d3f839936b0405bcda9bd0',
                                            '58d3f839936b0405bcda9bd1',
                                            '58d3f839936b0405bcda9bd2',
                                            '58d3f839936b0405bcda9bd3',
                                            '58d3f839936b0405bcda9bd4',
                                            '58d3f839936b0405bcda9bd5',
                                            '58d3f839936b0405bcda9bd6',
                                            '58d3f839936b0405bcda9bd7'
                                        ];

                return tripServices.getAvailableDrivers()
                .then(function (results){
                    expect(results).to.exist;
                    console.log(results);
                });
            });
        });
    });
    describe('Populate Available Drivers Validations Tests:\n', function () {
        describe('Negative Tests for populateDrivers function:\n', function () {

        });
        describe('Positive Tests for populateDrivers function:\n', function () {
            it('should return fully populated array of available drivers for current trip', function () {
                var tripId = '58f239c9b29bac343b01a074';
                return tripServices.fetchTripById(tripId)
                    .then(function(trip){
                        return tripServices.populateDrivers(trip.availableDrivers)
                            .then(function (results){
                                expect(results.length).to.equal(trip.availableDrivers.length);
                                expect(results[0].firstToText).to.exist;
                            });
                    });
            });
        });
    });
    describe('Populate Message Group Validations Tests:\n', function () {
        describe('Negative Tests for populateMessageGroup function:\n', function () {

        });
        describe('Positive Tests for populateMessageGroup function:\n', function () {
            it('should return fully populated array of available drivers for current trip', function () {
                var tripId = '58f239c9b29bac343b01a074';
                return tripServices.fetchTripById(tripId)
                    .then(function(trip){
                        return tripServices.populateDrivers(trip.availableDrivers)
                            .then(function (fullDriverInfo){
                                var remainingDriversToText = trip.availableDrivers.length;
                                var numDriversToText = trip.driverQuota;
                                var index = driverServices.fetchFirstToText(fullDriverInfo);
                                var messagingInfo = tripServices.populateMessageGroup(trip, fullDriverInfo, remainingDriversToText, numDriversToText, index);

                                expect(messagingInfo[0]).to.equal(trip.availableDrivers.length - numDriversToText);
                                expect(messagingInfo[1]).to.be.an.array;
                                expect(messagingInfo[1].length).to.equal(numDriversToText);
                                expect(trip.responses.noResponse.length).to.equal(numDriversToText);

                            });
                    });
            });
        });
    });
    describe('getDriverResponseDetails Validations Tests:\n', function () {
        describe('Negative Tests for getDriverResponseDetails function:\n', function () {

        });
        describe('Positive Tests for getDriverResponseDetails function:\n', function () {
            it('should pass by returning an array of driver objects corresponding to the response type', function (done) {
                var noResponseArray = [
                                        '58e14af183fa6356879d7f1b',
                                        '58e14af183fa6356879d7f0a',
                                        '58e14af183fa6356879d7f0b',
                                        '58e14af183fa6356879d7f0c',
                                        '58e14af183fa6356879d7f0d',
                                        '58e14af183fa6356879d7f0e',
                                        '58e14af183fa6356879d7f0f'
                                      ];
                var availableDrivers =  [
                                            {
                                                _id: '58e14af183fa6356879d7f0a',
                                                __v: 0,
                                                firstName: 'Jim',
                                                lastName: 'Westphal',
                                                mobilePhone: '479-936-4608',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 1,
                                                available: true },
                                            {
                                                _id: '58e14af183fa6356879d7f0b',
                                                __v: 37,
                                                firstName: 'Tom',
                                                lastName: 'Nolan',
                                                mobilePhone: '479-599-8090',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 2,
                                                available: true },
                                              {
                                                _id: '58e14af183fa6356879d7f0c',
                                                __v: 0,
                                                firstName: 'Mike',
                                                lastName: 'Thompson',
                                                mobilePhone: '479-799-5151',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 3,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f0d',
                                                __v: 9,
                                                firstName: 'Perry',
                                                lastName: 'Johnson',
                                                mobilePhone: '913-707-8379',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 4,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f0e',
                                                __v: 0,
                                                firstName: 'John',
                                                lastName: 'Wyckoff',
                                                mobilePhone: '316-655-3096',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 5,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f0f',
                                                __v: 0,
                                                firstName: 'Bob',
                                                lastName: 'Olson',
                                                mobilePhone: '479-802-8744',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 6,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f10',
                                                __v: 0,
                                                firstName: 'Barbara',
                                                lastName: 'Clary',
                                                mobilePhone: '479-531-7403',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 7,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f11',
                                                __v: 0,
                                                firstName: 'Jerry',
                                                lastName: 'Slyter',
                                                mobilePhone: '479-640-1029',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 8,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f12',
                                                __v: 0,
                                                firstName: 'Marjorie',
                                                lastName: 'Smith',
                                                mobilePhone: '479-644-6509',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 9,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f13',
                                                __v: 0,
                                                firstName: 'Don',
                                                lastName: 'Lawson',
                                                mobilePhone: '479-586-2209',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 10,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f14',
                                                __v: 0,
                                                firstName: 'John',
                                                lastName: 'Smith',
                                                mobilePhone: '479-644-6292',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 11,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f15',
                                                __v: 0,
                                                firstName: 'Bill',
                                                lastName: 'Pippin',
                                                mobilePhone: '479-282-5395',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 12,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f16',
                                                __v: 0,
                                                firstName: 'David',
                                                lastName: 'Moody',
                                                mobilePhone: '479-899-1902',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 13,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f17',
                                                __v: 4,
                                                firstName: 'Al',
                                                lastName: 'Yanik',
                                                mobilePhone: '479-366-0454',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [ [Object] ],
                                                seniorityRank: 14,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f18',
                                                __v: 0,
                                                firstName: 'Larie',
                                                lastName: 'Craig',
                                                mobilePhone: '479-301-5955',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 15,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f19',
                                                __v: 0,
                                                firstName: 'David',
                                                lastName: 'Phillips',
                                                mobilePhone: '479-621-1464',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 16,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f1a',
                                                __v: 0,
                                                firstName: 'Dean',
                                                lastName: 'Mangum',
                                                mobilePhone: '501-772-2373',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 17,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f1b',
                                                __v: 0,
                                                firstName: 'Gary',
                                                lastName: 'Holtgrewe',
                                                mobilePhone: '479-663-1032',
                                                deleted: false,
                                                text: true,
                                                firstToText: true,
                                                scheduleNote: [],
                                                seniorityRank: 18,
                                                available: true }
                                        ];
                var driverDetails = tripServices.getDriverResponseDetails(noResponseArray, availableDrivers);

                expect(driverDetails).to.be.an.array;
                expect(driverDetails).to.contain.an.object;
                expect(driverDetails).to.have.lengthOf(7);
                expect(driverDetails[0]).to.have.property('_id');
                expect(driverDetails[0]).to.have.property('firstName');
                expect(driverDetails[0]).to.have.property('lastName');
                expect(driverDetails[0]).to.have.property('mobilePhone');
                expect(driverDetails[0]).to.have.property('firstToText');

                done();
            });
            it('should pass by returning 0 if empty array is input', function (done) {
                var noResponseArray = [];
                var availableDrivers =  [
                                            {
                                                _id: '58e14af183fa6356879d7f0a',
                                                __v: 0,
                                                firstName: 'Jim',
                                                lastName: 'Westphal',
                                                mobilePhone: '479-936-4608',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 1,
                                                available: true },
                                            {
                                                _id: '58e14af183fa6356879d7f0b',
                                                __v: 37,
                                                firstName: 'Tom',
                                                lastName: 'Nolan',
                                                mobilePhone: '479-599-8090',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 2,
                                                available: true },
                                              {
                                                _id: '58e14af183fa6356879d7f0c',
                                                __v: 0,
                                                firstName: 'Mike',
                                                lastName: 'Thompson',
                                                mobilePhone: '479-799-5151',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 3,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f0d',
                                                __v: 9,
                                                firstName: 'Perry',
                                                lastName: 'Johnson',
                                                mobilePhone: '913-707-8379',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 4,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f0e',
                                                __v: 0,
                                                firstName: 'John',
                                                lastName: 'Wyckoff',
                                                mobilePhone: '316-655-3096',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 5,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f0f',
                                                __v: 0,
                                                firstName: 'Bob',
                                                lastName: 'Olson',
                                                mobilePhone: '479-802-8744',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 6,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f10',
                                                __v: 0,
                                                firstName: 'Barbara',
                                                lastName: 'Clary',
                                                mobilePhone: '479-531-7403',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 7,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f11',
                                                __v: 0,
                                                firstName: 'Jerry',
                                                lastName: 'Slyter',
                                                mobilePhone: '479-640-1029',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 8,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f12',
                                                __v: 0,
                                                firstName: 'Marjorie',
                                                lastName: 'Smith',
                                                mobilePhone: '479-644-6509',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 9,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f13',
                                                __v: 0,
                                                firstName: 'Don',
                                                lastName: 'Lawson',
                                                mobilePhone: '479-586-2209',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 10,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f14',
                                                __v: 0,
                                                firstName: 'John',
                                                lastName: 'Smith',
                                                mobilePhone: '479-644-6292',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 11,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f15',
                                                __v: 0,
                                                firstName: 'Bill',
                                                lastName: 'Pippin',
                                                mobilePhone: '479-282-5395',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 12,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f16',
                                                __v: 0,
                                                firstName: 'David',
                                                lastName: 'Moody',
                                                mobilePhone: '479-899-1902',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 13,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f17',
                                                __v: 4,
                                                firstName: 'Al',
                                                lastName: 'Yanik',
                                                mobilePhone: '479-366-0454',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [ [Object] ],
                                                seniorityRank: 14,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f18',
                                                __v: 0,
                                                firstName: 'Larie',
                                                lastName: 'Craig',
                                                mobilePhone: '479-301-5955',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 15,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f19',
                                                __v: 0,
                                                firstName: 'David',
                                                lastName: 'Phillips',
                                                mobilePhone: '479-621-1464',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 16,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f1a',
                                                __v: 0,
                                                firstName: 'Dean',
                                                lastName: 'Mangum',
                                                mobilePhone: '501-772-2373',
                                                deleted: false,
                                                text: true,
                                                firstToText: false,
                                                scheduleNote: [],
                                                seniorityRank: 17,
                                                available: true },
                                              { _id: '58e14af183fa6356879d7f1b',
                                                __v: 0,
                                                firstName: 'Gary',
                                                lastName: 'Holtgrewe',
                                                mobilePhone: '479-663-1032',
                                                deleted: false,
                                                text: true,
                                                firstToText: true,
                                                scheduleNote: [],
                                                seniorityRank: 18,
                                                available: true }
                                        ];
                var driverDetails = tripServices.getDriverResponseDetails(noResponseArray, availableDrivers);

                expect(driverDetails).to.be.a.number;
                expect(driverDetails).to.not.contain.an.object;
                expect(driverDetails).to.not.be.an.array;

                done();

            });
        });
    });
    describe('Build Trip Stats Object Validations Tests:\n', function () {
        describe('Negative Tests for buildTripStatsObject function:\n', function () {

        });
        describe('Positive Tests for buildTripStatsObject function:\n', function () {
            it('should pass for inital message group', function () {
                // Driverquota = 7
                // Available drivers = 18
                // Gary Holtgrewe (rank = 18) starts as first to Text;
                var tripId = '58f239c9b29bac343b01a074';
                return tripServices.fetchTripById(tripId)
                    .then(function(trip){
                        console.log('trip in test: ', trip);
                        return tripServices.populateDrivers(trip.availableDrivers)
                        .then(function(allDriversAvailable){
                            var driversRemainingToText = trip.totalAvailableDrivers = trip.availableDrivers.length;
                            var driversForMessageGroup = trip.driverQuota;
                            var firstToTextIndex = driverServices.fetchFirstToText(allDriversAvailable);

                            var index = firstToTextIndex;
                            var messagingInfo = tripServices.populateMessageGroup(trip, allDriversAvailable, driversRemainingToText, driversForMessageGroup, index);
                            driversRemainingToText = messagingInfo[0];
                            var driversToMessageGroup = messagingInfo[1];

                            var tripStats = tripServices.buildTripStatsObject(driversRemainingToText, driversToMessageGroup, trip, allDriversAvailable, firstToTextIndex);
                            console.log('tripStats in test: ', tripStats);
                            expect(tripStats).to.exist;
                            expect(tripStats).to.an.object;
                            expect(tripStats).to.have.property('driversRemainingToText', 11);
                            expect(tripStats.driversRemainingToText).to.be.a.number;
                            expect(tripStats).to.have.property('driversToMessageGroup');
                            expect(tripStats.driversToMessageGroup).to.be.an.array;
                            expect(tripStats.driversToMessageGroup).to.have.lengthOf(7);
                            expect(tripStats).to.have.property('driversNoResponse');
                            expect(tripStats.driversNoResponse).to.be.an.array;
                            expect(tripStats.driversNoResponse).to.have.lengthOf(7)
                            expect(tripStats).to.have.property('driverYesAccepted');
                            expect(tripStats.driverYesAccepted).to.be.an.array;
                            expect(tripStats.driverYesAccepted).to.be.empty;
                            expect(tripStats).to.have.property('driverYesRejected');
                            expect(tripStats.driverYesRejected).to.be.an.array;
                            expect(tripStats.driverYesRejected).to.be.empty;
                            expect(tripStats).to.have.property('driverDeclined');
                            expect(tripStats.driverDeclined).to.be.an.array;
                            expect(tripStats.driverDeclined).to.be.empty;
                            expect(tripStats).to.have.property('driversNeeded');
                            expect(tripStats.driversNeeded).to.be.a.number;
                            expect(tripStats.driversNeeded).to.equal(7);
                            expect(tripStats).to.have.property('LastDriverMessaged');
                            expect(tripStats.LastDriverMessaged).to.be.a.string;
                            expect(tripStats.LastDriverMessaged).to.equal('Bob Olson');
                            expect(tripStats).to.have.property('nextToText');
                            expect(tripStats.nextToText).to.be.a.string;
                            expect(tripStats.nextToText).to.equal('Barbara Clary');
                            expect(tripStats).to.have.property('timeRemaining');
                        });
                    });
            });
        });
    });

    describe('setResponseWindow Validations Tests:\n', function () {
        describe('Negative Tests for setResponseWindow function:\n', function () {
            it ('should pass with currentTime after tripTime ', function () {
                var tripId = '58f239c9b29bac343b01a074';
                var initialize = 0;
                return tripServices.fetchTripById(tripId)
                    .then(function(trip){
                        return tripServices.populateDrivers(trip.availableDrivers)
                            .then(function (allDriversAvailable){
                                var tripStats = tripServices.setResponseWindow(trip, allDriversAvailable);
                                expect(tripStats).to.exist;
                            });

                    });
            });
        });
        describe('Positive Tests for setResponseWindow function:\n', function () {
            it ('should pass', function () {

                var tripId = '58f28b4577d16345ab80ca90';
                return tripServices.fetchTripById(tripId)
                    .then(function(trip){
                        return tripServices.populateDrivers(trip.availableDrivers)
                            .then(function (allDriversAvailable){
                                tripServices.setResponseWindow(trip, allDriversAvailable);
                                expect(trip.responses.noResponse.length)
                            });

                    });
            });
        });
    });
    describe('Start Trip Monitor Validations Tests:\n', function () {
        describe('Negative Tests for startTripMonitor function:\n', function () {

        });
        describe('Positive Tests for startTripMonitor function:\n', function () {
            it('should pass', function (){
                var tripId = '58f239c9b29bac343b01a074';
                return tripServices.fetchTripById(tripId)
                    .then(function(trip){
                        return tripServices.populateDrivers(trip.availableDrivers)
                            .then(function (allDriversAvailable){
                                var tripStats = tripServices.startTripMonitor(trip, allDriversAvailable);
                                expect(tripStats).to.exist();
                            });

                    });
            });
        });
    });
    describe('Send Text Validations Tests:\n', function () {
        describe('Negative Tests for sendText function:\n', function () {

        });
        describe('Positive Tests for sendText function:\n', function () {
            it('should send a text to the indicated recipient(s)', function (done){

                // var tripId = '58f4209027498f76ff54659c';
                // return tripServices.fetchTripById(tripId)
                //     .then(function(trip){
                //         return tripServices.populateDrivers(trip.availableDrivers)
                //             .then(function (allDriversAvailable){
                //                 var tripStats = tripServices.startTripMonitor(trip, allDriversAvailable);
                //                 console.log('tripStats in test for setResponseWindow: ', tripStats);
                //             });
                //
                //     });


                var drivers = [{mobilePhone: '479-715-7785'}];
                var message = 'Will you accept a trip to TUL TODAY, 04-17-2017, at 22:30? Reply: 1=YES, 2=NO. Please respond by 22:00 TODAY.';
                var result = tripServices.sendText(drivers, message);
                expect(result).to.equal(true);
                done();

            });
        });
    });

    describe('fetchDriverIdByPhone Validations Tests:\n', function () {
        describe('Negative Tests for fetchDriverIdByPhone function:\n', function () {

        });
        describe('Positive Tests for fetchDriverIdByPhone function:\n', function () {
            it('should return the driverId for the phoneNumber passed', function(done) {
                var phone = '479-715-7785';
                var availableDrivers = [
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24a",
                                            "__v" : 0,
                                            "firstName" : "DeLani",
                                            "lastName" : "Bartlett",
                                            "mobilePhone" : "479-225-0048",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 1,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24b",
                                            "__v" : 0,
                                            "firstName" : "Siqi",
                                            "lastName" : "Ji",
                                            "mobilePhone" : "479-715-9228",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 2,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24c",
                                            "__v" : 0,
                                            "firstName" : "Roger",
                                            "lastName" : "Jones",
                                            "mobilePhone" : "479-685-6163",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 3,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24d",
                                            "__v" : 0,
                                            "firstName" : "Perry",
                                            "lastName" : "Johnson",
                                            "mobilePhone" : "913-707-8379",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 4,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24e",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Wyckoff",
                                            "mobilePhone" : "316-655-3096",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 5,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24f",
                                            "__v" : 0,
                                            "firstName" : "Bob",
                                            "lastName" : "Olson",
                                            "mobilePhone" : "479-802-8744",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 6,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd250",
                                            "__v" : 0,
                                            "firstName" : "Linda",
                                            "lastName" : "Scholz",
                                            "mobilePhone" : "479-270-0318",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 7,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd251",
                                            "__v" : 0,
                                            "firstName" : "Jerry",
                                            "lastName" : "Slyter",
                                            "mobilePhone" : "479-640-1029",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 8,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd252",
                                            "__v" : 0,
                                            "firstName" : "Camra",
                                            "lastName" : "Fougere",
                                            "mobilePhone" : "479-287-7463",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 9,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd253",
                                            "__v" : 0,
                                            "firstName" : "Don",
                                            "lastName" : "Lawson",
                                            "mobilePhone" : "479-586-2209",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 10,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd254",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Smith",
                                            "mobilePhone" : "479-644-6292",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 11,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd255",
                                            "__v" : 0,
                                            "firstName" : "Emily",
                                            "lastName" : "Patel",
                                            "mobilePhone" : "479-426-8276",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 12,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd256",
                                            "__v" : 0,
                                            "firstName" : "Leeper",
                                            "lastName" : "Palin",
                                            "mobilePhone" : "386-748-6197",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 13,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd257",
                                            "__v" : 0,
                                            "firstName" : "Keith",
                                            "lastName" : "Evans",
                                            "mobilePhone" : "972-978-8723",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [
                                                                    {
                                                                    "note" : "Test Note for Al!",
                                                                    "_id" : "58f8d6ac3d22fd14dfefd258",
                                                                    "createDate" : "2017-04-20T15:41:32.027Z"
                                                                    }
                                            ],
                                            "seniorityRank" : 14,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd259",
                                            "__v" : 0,
                                            "firstName" : "Larie",
                                            "lastName" : "Craig",
                                            "mobilePhone" : "479-301-5955",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 15,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25a",
                                            "__v" : 0,
                                            "firstName" : "Cathy",
                                            "lastName" : "Riley",
                                            "mobilePhone" : "847-508-3472",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 16,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25b",
                                            "__v" : 0,
                                            "firstName" : "Jodi",
                                            "lastName" : "De Grave",
                                            "mobilePhone" : "479-715-7785",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 17,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25c",
                                            "__v" : 0,
                                            "firstName" : "David",
                                            "lastName" : "Hickman",
                                            "mobilePhone" : "479-270-7793",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 18,
                                            "available" : false
                                        }
                                    ];

                var driverId = tripServices.fetchDriverIdByPhone(phone, availableDrivers);
                expect(driverId).to.equal('58f8d6ac3d22fd14dfefd25b');
                done();
            });
        });
    });
    describe ('Fetch Last Driver Response Validations Tests:\n', function () {
        describe('Negative Tests for fetchLastDriverResponse function:\n', function () {
            it('should pass if there are empty arrays to check; driver Id found in declined array', function (done){
                driverId = '58f8d6ac3d22fd14dfefd25b';
                var trip = {
                                driverQuota : 3,
                                responses : {
                                                noResponse : [],
                                                yesAccepted : [],
                                                yesRejected : [],
                                                declined : [ '58f8d6ac3d22fd14dfefd24a','58f8d6ac3d22fd14dfefd25c', '58f8d6ac3d22fd14dfefd25a','58f8d6ac3d22fd14dfefd25b']
                                            }
                            };
                var results = tripServices.fetchLastDriverResponse(trip, driverId);
                expect(results).to.exist;
                expect(results[0]).to.equal('declined');
                expect(results[1]).to.equal(3);

                done();
            });
        });
        describe('Positive Tests for fetchLastDriverResponse function:\n', function () {
            it('should find the driver in the noResponse array', function (done){

                driverId = '58f8d6ac3d22fd14dfefd25b';
                var trip = {
                                driverQuota : 3,
                                responses : {
                                                noResponse : ['58f8d6ac3d22fd14dfefd25c', '58f8d6ac3d22fd14dfefd25b', '58f8d6ac3d22fd14dfefd259'],
                                                yesAccepted : ['58f8d6ac3d22fd14dfefd25a','58f8d6ac3d22fd14dfefd255','58f8d6ac3d22fd14dfefd254', '58f8d6ac3d22fd14dfefd250'],
                                                yesRejected : ['58f8d6ac3d22fd14dfefd24a'],
                                                declined : []
                                            }
                            };
                var results = tripServices.fetchLastDriverResponse(trip, driverId);
                expect(results).to.exist;
                expect(results[0]).to.equal('noResponse');
                expect(results[1]).to.equal(1);

                done();
            });
        });
    });

    describe('Check Driver Response Validations Tests:\n', function () {
        describe('Negative Tests for checkDriverResponse function:\n', function () {
            it('it should false for valid phone number with too many characters and the driver response', function (done) {
                var from = '+1409090901577859859';
                var body = '1';

                var results = tripServices.checkDriverResponse(from, body);

                expect(results).to.exist;
                expect(results[0]).to.equal(false);
                expect(results[1]).to.equal(true);

                done();

            });
            it('it should return false for an empty string as a  driver response', function (done) {
                var from = '+14797157785';
                var body = '';

                var results = tripServices.checkDriverResponse(from, body);

                expect(results).to.exist;
                expect(results[0]).to.exist;
                expect(results[0]).to.equal('479-715-7785');
                expect(results[1]).to.equal(false);

                done();

            });
            it('it should return false for a spaces as a  driver response', function (done) {
                var from = '+14797157785';
                var body = '   ';

                var results = tripServices.checkDriverResponse(from, body);

                expect(results).to.exist;
                expect(results[0]).to.exist;
                expect(results[0]).to.equal('479-715-7785');
                expect(results[1]).to.equal(false);

                done();

            });
            it('it should return false for a driver response longer than 1 character', function (done) {
                var from = '+14797157785';
                var body = 'alphabet soup';

                var results = tripServices.checkDriverResponse(from, body);

                expect(results).to.exist;
                expect(results[0]).to.exist;
                expect(results[0]).to.equal('479-715-7785');
                expect(results[1]).to.equal(false);

                done();

            });
            it('it should return false for a driver response of null', function (done) {
                var from = '+14797157785';
                var body = null;

                var results = tripServices.checkDriverResponse(from, body);

                expect(results).to.exist;
                expect(results[0]).to.exist;
                expect(results[0]).to.equal('479-715-7785');
                expect(results[1]).to.equal(false);

                done();

            });
            it('it should return false for a driver response of undefined', function (done) {
                var from = '+14797157785';
                var body = null;

                var results = tripServices.checkDriverResponse(from, body);

                expect(results).to.exist;
                expect(results[0]).to.exist;
                expect(results[0]).to.equal('479-715-7785');
                expect(results[1]).to.equal(false);

                done();

            });
        });
        describe('Positive Tests for checkDriverResponse function:\n', function () {
            it('it should return a valid phone number formatted for the db and the driver response', function (done) {
                var from = '+14797157785';
                var body = '1';

                var results = tripServices.checkDriverResponse(from, body);

                expect(results).to.exist;
                expect(results[0]).to.equal('479-715-7785');
                expect(results[1]).to.equal(true);

                done();

            });

        });
    });

    describe('Receive Text Validations Tests:\n', function () {
        describe('Negative Tests for receiveText function:\n', function () {
            it('not move driver if it is a duplicate response of (1/y/Y)', function (done) {
                var from = '479-715-7785';
                var body = 1;
                var fakeTripResponsesArrays = {
                                                driverQuota : 3,
                                                responses : {
                                                                yesAccepted : ['58f8d6ac3d22fd14dfefd24a', '58f8d6ac3d22fd14dfefd25b'],
                                                                yesRejected : [],
                                                                declined : ['58f8d6ac3d22fd14dfefd24c','58f8d6ac3d22fd14dfefd250',
                                                                            '58f8d6ac3d22fd14dfefd252','58f8d6ac3d22fd14dfefd255'],
                                                                noResponse :    ['58f8d6ac3d22fd14dfefd256','58f8d6ac3d22fd14dfefd257',
                                                                                '58f8d6ac3d22fd14dfefd25a','58f8d6ac3d22fd14dfefd24b',
                                                                                '58f8d6ac3d22fd14dfefd25c']
                                                            }
                                                };


                var availableDrivers = [
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24a",
                                            "__v" : 0,
                                            "firstName" : "DeLani",
                                            "lastName" : "Bartlett",
                                            "mobilePhone" : "479-225-0048",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 1,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24b",
                                            "__v" : 0,
                                            "firstName" : "Siqi",
                                            "lastName" : "Ji",
                                            "mobilePhone" : "479-715-9228",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 2,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24c",
                                            "__v" : 0,
                                            "firstName" : "Roger",
                                            "lastName" : "Jones",
                                            "mobilePhone" : "479-685-6163",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 3,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24d",
                                            "__v" : 0,
                                            "firstName" : "Perry",
                                            "lastName" : "Johnson",
                                            "mobilePhone" : "913-707-8379",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 4,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24e",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Wyckoff",
                                            "mobilePhone" : "316-655-3096",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 5,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24f",
                                            "__v" : 0,
                                            "firstName" : "Bob",
                                            "lastName" : "Olson",
                                            "mobilePhone" : "479-802-8744",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 6,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd250",
                                            "__v" : 0,
                                            "firstName" : "Linda",
                                            "lastName" : "Scholz",
                                            "mobilePhone" : "479-270-0318",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 7,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd251",
                                            "__v" : 0,
                                            "firstName" : "Jerry",
                                            "lastName" : "Slyter",
                                            "mobilePhone" : "479-640-1029",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 8,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd252",
                                            "__v" : 0,
                                            "firstName" : "Camra",
                                            "lastName" : "Fougere",
                                            "mobilePhone" : "479-287-7463",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 9,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd253",
                                            "__v" : 0,
                                            "firstName" : "Don",
                                            "lastName" : "Lawson",
                                            "mobilePhone" : "479-586-2209",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 10,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd254",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Smith",
                                            "mobilePhone" : "479-644-6292",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 11,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd255",
                                            "__v" : 0,
                                            "firstName" : "Emily",
                                            "lastName" : "Patel",
                                            "mobilePhone" : "479-426-8276",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 12,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd256",
                                            "__v" : 0,
                                            "firstName" : "Leeper",
                                            "lastName" : "Palin",
                                            "mobilePhone" : "386-748-6197",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 13,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd257",
                                            "__v" : 0,
                                            "firstName" : "Keith",
                                            "lastName" : "Evans",
                                            "mobilePhone" : "972-978-8723",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [
                                                                    {
                                                                    "note" : "Test Note for Al!",
                                                                    "_id" : "58f8d6ac3d22fd14dfefd258",
                                                                    "createDate" : "2017-04-20T15:41:32.027Z"
                                                                    }
                                            ],
                                            "seniorityRank" : 14,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd259",
                                            "__v" : 0,
                                            "firstName" : "Larie",
                                            "lastName" : "Craig",
                                            "mobilePhone" : "479-301-5955",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 15,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25a",
                                            "__v" : 0,
                                            "firstName" : "Cathy",
                                            "lastName" : "Riley",
                                            "mobilePhone" : "847-508-3472",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 16,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25b",
                                            "__v" : 0,
                                            "firstName" : "Jodi",
                                            "lastName" : "De Grave",
                                            "mobilePhone" : "479-715-7785",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 17,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25c",
                                            "__v" : 0,
                                            "firstName" : "David",
                                            "lastName" : "Hickman",
                                            "mobilePhone" : "479-270-7793",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 18,
                                            "available" : false
                                        }
                                    ];

                var results = tripServices.receiveText(from, body, fakeTripResponsesArrays, availableDrivers);
                expect(results).to.exist;
                expect(results).to.equal('duplicate');
                expect(fakeTripResponsesArrays.responses.yesAccepted).to.have.lengthOf(2);
                expect(fakeTripResponsesArrays.responses.yesAccepted[1]).to.equal('58f8d6ac3d22fd14dfefd25b');

                done();
            });
        });
        describe('Positive Tests for receiveText function:\n', function () {
            it('should pass if the response is yes (1/y/Y) and driverQuota not met yet', function (done){
                var from = '479-715-7785';
                var body = 1;

                var fakeTripResponsesArrays = {
                                                driverQuota : 3,
                                                responses : {
                                                                yesAccepted : ['58f8d6ac3d22fd14dfefd24a', '58f8d6ac3d22fd14dfefd24b'],
                                                                yesRejected : [],
                                                                declined : ['58f8d6ac3d22fd14dfefd24c','58f8d6ac3d22fd14dfefd250',
                                                                            '58f8d6ac3d22fd14dfefd252','58f8d6ac3d22fd14dfefd255'],
                                                                noResponse :    ['58f8d6ac3d22fd14dfefd256','58f8d6ac3d22fd14dfefd257',
                                                                                '58f8d6ac3d22fd14dfefd25a','58f8d6ac3d22fd14dfefd25b',
                                                                                '58f8d6ac3d22fd14dfefd25c']
                                                            }
                                                };

                var availableDrivers = [
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24a",
                                            "__v" : 0,
                                            "firstName" : "DeLani",
                                            "lastName" : "Bartlett",
                                            "mobilePhone" : "479-225-0048",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 1,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24b",
                                            "__v" : 0,
                                            "firstName" : "Siqi",
                                            "lastName" : "Ji",
                                            "mobilePhone" : "479-715-9228",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 2,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24c",
                                            "__v" : 0,
                                            "firstName" : "Roger",
                                            "lastName" : "Jones",
                                            "mobilePhone" : "479-685-6163",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 3,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24d",
                                            "__v" : 0,
                                            "firstName" : "Perry",
                                            "lastName" : "Johnson",
                                            "mobilePhone" : "913-707-8379",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 4,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24e",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Wyckoff",
                                            "mobilePhone" : "316-655-3096",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 5,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24f",
                                            "__v" : 0,
                                            "firstName" : "Bob",
                                            "lastName" : "Olson",
                                            "mobilePhone" : "479-802-8744",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 6,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd250",
                                            "__v" : 0,
                                            "firstName" : "Linda",
                                            "lastName" : "Scholz",
                                            "mobilePhone" : "479-270-0318",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 7,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd251",
                                            "__v" : 0,
                                            "firstName" : "Jerry",
                                            "lastName" : "Slyter",
                                            "mobilePhone" : "479-640-1029",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 8,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd252",
                                            "__v" : 0,
                                            "firstName" : "Camra",
                                            "lastName" : "Fougere",
                                            "mobilePhone" : "479-287-7463",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 9,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd253",
                                            "__v" : 0,
                                            "firstName" : "Don",
                                            "lastName" : "Lawson",
                                            "mobilePhone" : "479-586-2209",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 10,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd254",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Smith",
                                            "mobilePhone" : "479-644-6292",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 11,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd255",
                                            "__v" : 0,
                                            "firstName" : "Emily",
                                            "lastName" : "Patel",
                                            "mobilePhone" : "479-426-8276",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 12,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd256",
                                            "__v" : 0,
                                            "firstName" : "Leeper",
                                            "lastName" : "Palin",
                                            "mobilePhone" : "386-748-6197",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 13,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd257",
                                            "__v" : 0,
                                            "firstName" : "Keith",
                                            "lastName" : "Evans",
                                            "mobilePhone" : "972-978-8723",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [
                                                                    {
                                                                    "note" : "Test Note for Al!",
                                                                    "_id" : "58f8d6ac3d22fd14dfefd258",
                                                                    "createDate" : "2017-04-20T15:41:32.027Z"
                                                                    }
                                            ],
                                            "seniorityRank" : 14,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd259",
                                            "__v" : 0,
                                            "firstName" : "Larie",
                                            "lastName" : "Craig",
                                            "mobilePhone" : "479-301-5955",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 15,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25a",
                                            "__v" : 0,
                                            "firstName" : "Cathy",
                                            "lastName" : "Riley",
                                            "mobilePhone" : "847-508-3472",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 16,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25b",
                                            "__v" : 0,
                                            "firstName" : "Jodi",
                                            "lastName" : "De Grave",
                                            "mobilePhone" : "479-715-7785",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 17,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25c",
                                            "__v" : 0,
                                            "firstName" : "David",
                                            "lastName" : "Hickman",
                                            "mobilePhone" : "479-270-7793",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 18,
                                            "available" : false
                                        }
                                    ];

                var results = tripServices.receiveText(from, body, fakeTripResponsesArrays, availableDrivers);
                expect(results).to.exist;
                expect(results).to.equal('accept');
                expect(fakeTripResponsesArrays.responses.yesAccepted).to.have.lengthOf(3);
                expect(fakeTripResponsesArrays.responses.noResponse).to.have.lengthOf(4);

                done();
            });
            it('should pass if the response is no (2/y/Y) and driverQuota not met yet', function (done){
                var from = '479-715-7785';
                var body = 1;

                var fakeTripResponsesArrays = {
                                                driverQuota : 3,
                                                responses : {
                                                                yesAccepted : ['58f8d6ac3d22fd14dfefd24a', '58f8d6ac3d22fd14dfefd24b'],
                                                                yesRejected : [],
                                                                declined : ['58f8d6ac3d22fd14dfefd24c','58f8d6ac3d22fd14dfefd250',
                                                                            '58f8d6ac3d22fd14dfefd252','58f8d6ac3d22fd14dfefd255'],
                                                                noResponse :    ['58f8d6ac3d22fd14dfefd256','58f8d6ac3d22fd14dfefd257',
                                                                                '58f8d6ac3d22fd14dfefd25a','58f8d6ac3d22fd14dfefd25b',
                                                                                '58f8d6ac3d22fd14dfefd25c']
                                                            }
                                                };

                var availableDrivers = [
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24a",
                                            "__v" : 0,
                                            "firstName" : "DeLani",
                                            "lastName" : "Bartlett",
                                            "mobilePhone" : "479-225-0048",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 1,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24b",
                                            "__v" : 0,
                                            "firstName" : "Siqi",
                                            "lastName" : "Ji",
                                            "mobilePhone" : "479-715-9228",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 2,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24c",
                                            "__v" : 0,
                                            "firstName" : "Roger",
                                            "lastName" : "Jones",
                                            "mobilePhone" : "479-685-6163",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 3,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24d",
                                            "__v" : 0,
                                            "firstName" : "Perry",
                                            "lastName" : "Johnson",
                                            "mobilePhone" : "913-707-8379",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 4,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24e",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Wyckoff",
                                            "mobilePhone" : "316-655-3096",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 5,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24f",
                                            "__v" : 0,
                                            "firstName" : "Bob",
                                            "lastName" : "Olson",
                                            "mobilePhone" : "479-802-8744",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 6,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd250",
                                            "__v" : 0,
                                            "firstName" : "Linda",
                                            "lastName" : "Scholz",
                                            "mobilePhone" : "479-270-0318",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 7,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd251",
                                            "__v" : 0,
                                            "firstName" : "Jerry",
                                            "lastName" : "Slyter",
                                            "mobilePhone" : "479-640-1029",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 8,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd252",
                                            "__v" : 0,
                                            "firstName" : "Camra",
                                            "lastName" : "Fougere",
                                            "mobilePhone" : "479-287-7463",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 9,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd253",
                                            "__v" : 0,
                                            "firstName" : "Don",
                                            "lastName" : "Lawson",
                                            "mobilePhone" : "479-586-2209",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 10,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd254",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Smith",
                                            "mobilePhone" : "479-644-6292",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 11,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd255",
                                            "__v" : 0,
                                            "firstName" : "Emily",
                                            "lastName" : "Patel",
                                            "mobilePhone" : "479-426-8276",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 12,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd256",
                                            "__v" : 0,
                                            "firstName" : "Leeper",
                                            "lastName" : "Palin",
                                            "mobilePhone" : "386-748-6197",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 13,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd257",
                                            "__v" : 0,
                                            "firstName" : "Keith",
                                            "lastName" : "Evans",
                                            "mobilePhone" : "972-978-8723",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [
                                                                    {
                                                                    "note" : "Test Note for Al!",
                                                                    "_id" : "58f8d6ac3d22fd14dfefd258",
                                                                    "createDate" : "2017-04-20T15:41:32.027Z"
                                                                    }
                                            ],
                                            "seniorityRank" : 14,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd259",
                                            "__v" : 0,
                                            "firstName" : "Larie",
                                            "lastName" : "Craig",
                                            "mobilePhone" : "479-301-5955",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 15,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25a",
                                            "__v" : 0,
                                            "firstName" : "Cathy",
                                            "lastName" : "Riley",
                                            "mobilePhone" : "847-508-3472",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 16,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25b",
                                            "__v" : 0,
                                            "firstName" : "Jodi",
                                            "lastName" : "De Grave",
                                            "mobilePhone" : "479-715-7785",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 17,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25c",
                                            "__v" : 0,
                                            "firstName" : "David",
                                            "lastName" : "Hickman",
                                            "mobilePhone" : "479-270-7793",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 18,
                                            "available" : false
                                        }
                                    ];

                var results = tripServices.receiveText(from, body, fakeTripResponsesArrays, availableDrivers);
                expect(results).to.exist;
                expect(results).to.equal('accept');
                expect(fakeTripResponsesArrays.responses.yesAccepted).to.have.lengthOf(3);
                expect(fakeTripResponsesArrays.responses.noResponse).to.have.lengthOf(4);

                done();
            });
            it ('should pass with yesRejected returned if the response is yes (1/y/Y) and driverQuota is met ', function (done){
                var from = '479-715-7785';
                var body = 1;

                var fakeTripResponsesArrays = {
                                                driverQuota : 2,
                                                responses : {
                                                                yesAccepted : ['58f8d6ac3d22fd14dfefd24a', '58f8d6ac3d22fd14dfefd25a'],
                                                                yesRejected : [],
                                                                declined : ['58f8d6ac3d22fd14dfefd24c','58f8d6ac3d22fd14dfefd250',
                                                                            '58f8d6ac3d22fd14dfefd252','58f8d6ac3d22fd14dfefd255'],
                                                                noResponse :    ['58f8d6ac3d22fd14dfefd256','58f8d6ac3d22fd14dfefd257',
                                                                                '58f8d6ac3d22fd14dfefd24b','58f8d6ac3d22fd14dfefd25b',
                                                                                '58f8d6ac3d22fd14dfefd25c']
                                                            }
                                                };

                var availableDrivers = [
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24a",
                                            "__v" : 0,
                                            "firstName" : "DeLani",
                                            "lastName" : "Bartlett",
                                            "mobilePhone" : "479-225-0048",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 1,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24b",
                                            "__v" : 0,
                                            "firstName" : "Siqi",
                                            "lastName" : "Ji",
                                            "mobilePhone" : "479-715-9228",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 2,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24c",
                                            "__v" : 0,
                                            "firstName" : "Roger",
                                            "lastName" : "Jones",
                                            "mobilePhone" : "479-685-6163",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 3,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24d",
                                            "__v" : 0,
                                            "firstName" : "Perry",
                                            "lastName" : "Johnson",
                                            "mobilePhone" : "913-707-8379",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 4,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24e",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Wyckoff",
                                            "mobilePhone" : "316-655-3096",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 5,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd24f",
                                            "__v" : 0,
                                            "firstName" : "Bob",
                                            "lastName" : "Olson",
                                            "mobilePhone" : "479-802-8744",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 6,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd250",
                                            "__v" : 0,
                                            "firstName" : "Linda",
                                            "lastName" : "Scholz",
                                            "mobilePhone" : "479-270-0318",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 7,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd251",
                                            "__v" : 0,
                                            "firstName" : "Jerry",
                                            "lastName" : "Slyter",
                                            "mobilePhone" : "479-640-1029",
                                            "deleted" : false,
                                            "text" : false,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 8,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd252",
                                            "__v" : 0,
                                            "firstName" : "Camra",
                                            "lastName" : "Fougere",
                                            "mobilePhone" : "479-287-7463",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 9,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd253",
                                            "__v" : 0,
                                            "firstName" : "Don",
                                            "lastName" : "Lawson",
                                            "mobilePhone" : "479-586-2209",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 10,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd254",
                                            "__v" : 0,
                                            "firstName" : "John",
                                            "lastName" : "Smith",
                                            "mobilePhone" : "479-644-6292",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 11,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd255",
                                            "__v" : 0,
                                            "firstName" : "Emily",
                                            "lastName" : "Patel",
                                            "mobilePhone" : "479-426-8276",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 12,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd256",
                                            "__v" : 0,
                                            "firstName" : "Leeper",
                                            "lastName" : "Palin",
                                            "mobilePhone" : "386-748-6197",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 13,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd257",
                                            "__v" : 0,
                                            "firstName" : "Keith",
                                            "lastName" : "Evans",
                                            "mobilePhone" : "972-978-8723",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [
                                                                    {
                                                                    "note" : "Test Note for Al!",
                                                                    "_id" : "58f8d6ac3d22fd14dfefd258",
                                                                    "createDate" : "2017-04-20T15:41:32.027Z"
                                                                    }
                                            ],
                                            "seniorityRank" : 14,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd259",
                                            "__v" : 0,
                                            "firstName" : "Larie",
                                            "lastName" : "Craig",
                                            "mobilePhone" : "479-301-5955",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 15,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25a",
                                            "__v" : 0,
                                            "firstName" : "Cathy",
                                            "lastName" : "Riley",
                                            "mobilePhone" : "847-508-3472",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : false,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 16,
                                            "available" : false
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25b",
                                            "__v" : 0,
                                            "firstName" : "Jodi",
                                            "lastName" : "De Grave",
                                            "mobilePhone" : "479-715-7785",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 17,
                                            "available" : true
                                        },
                                        {
                                            "_id" : "58f8d6ac3d22fd14dfefd25c",
                                            "__v" : 0,
                                            "firstName" : "David",
                                            "lastName" : "Hickman",
                                            "mobilePhone" : "479-270-7793",
                                            "deleted" : false,
                                            "text" : true,
                                            "firstToText" : true,
                                            "scheduleNote" : [ ],
                                            "seniorityRank" : 18,
                                            "available" : false
                                        }
                                    ];

                var results = tripServices.receiveText(from, body, fakeTripResponsesArrays, availableDrivers);
                expect(results).to.exist;
                expect(results).to.equal('reject');
                expect(fakeTripResponsesArrays.responses.yesAccepted).to.have.lengthOf(2);
                expect(fakeTripResponsesArrays.responses.noResponse).to.have.lengthOf(4);
                expect(fakeTripResponsesArrays.responses.yesRejected).to.have.lengthOf(1);

                done();
            });
        });
    });

    describe('Update Response Arrays Validations Tests:\n', function () {
        describe('Negative Tests for updateResponseArrays function:\n', function () {

        });
        describe('Positive Tests for updateResponseArrays function:\n', function () {
            it('should pass if the response is yes (1/y/Y)', function (done) {
                var driverId = '58f8d6ac3d22fd14dfefd25b';
                var index = 3;
                var oldResponseArrayName = 'noResponse';
                var fakeTripResponsesArrays = {
                                                driverQuota : 3,
                                                responses : {
                                                                yesAccepted : ['58f8d6ac3d22fd14dfefd24a', '58f8d6ac3d22fd14dfefd24b'],
                                                                yesRejected : [],
                                                                declined : ['58f8d6ac3d22fd14dfefd24c','58f8d6ac3d22fd14dfefd250',
                                                                            '58f8d6ac3d22fd14dfefd252','58f8d6ac3d22fd14dfefd255'],
                                                                noResponse :    ['58f8d6ac3d22fd14dfefd256','58f8d6ac3d22fd14dfefd257',
                                                                                '58f8d6ac3d22fd14dfefd25a','58f8d6ac3d22fd14dfefd25b',
                                                                                '58f8d6ac3d22fd14dfefd25c']
                                                            }
                                                };


                tripServices.updateResponseArrays(oldResponseArrayName, 'yesAccepted', driverId, index, fakeTripResponsesArrays);
                expect(fakeTripResponsesArrays.responses.yesAccepted).to.have.lengthOf(3);
                expect(fakeTripResponsesArrays.responses.noResponse).to.have.lengthOf(4);

                done();
            });
        });
    });

    describe('Get Remaining Time Validations Tests:\n', function () {
        describe('Negative Tests for getReminingTime function:\n', function () {

        });
        describe('Positive Tests for getReminingTime function:\n', function () {
            it ('should pass', function () {
                var tripId = '58f239c9b29bac343b01a074';
                return tripServices.fetchTripById(tripId)
                    .then(function(trip){
                        var endTime = tripServices.getReminingTime(trip.responseDeadline);
                        var deadline = moment(trip.responseDeadline).format('HH:mm:ss');
                        expect(endTime).to.exist;
                        expect(endTime).to.be.below(deadline);
                    });
            });
        });
    });
});
