var chai = require ('chai');
var expect = chai.expect;
var chaiDateTime = require ('chai-datetime');
var assertIntegers = require ('chai-integer');
var Driver = require('../models/driver.model');
var Location = require('../models/location.model');
var moment = require('moment');

chai.use(assertIntegers);
chai.use(chaiDateTime);

var mongoose = require('mongoose');
mongoose.Promises = global.Promise;

var Trip = require ('../models/trip.model');

describe.skip ('Trip Schema Validation Tests:\n', function () {
    describe ('City Code Object ID Validation Tests:\n', function () {
        describe ('Negative Tests for City Code:\n', function () {
            it ('should error if no city code ObjectId is provided', function (done){
                var trip = new Trip ();
                var error;

                trip.cityCode;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.cityCode).to.exist;
                expect(error.errors.cityCode.value).to.be.undefined;
                expect(error.errors.cityCode.name).to.equal('ValidatorError');
                expect(error.errors.cityCode.message).to.equal('City Code is required.');

                done();

            });
        });
        describe ('Positive Tests for City Code:\n', function () {
            it ('should pass if a city code ObjectId is provided', function (done) {
                var trip = new Trip ();
                var error;

                trip.cityCode = '58d3f839936b0405bcda9bd8';
                error = trip.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(trip.cityCode.toString()).to.equal('58d3f839936b0405bcda9bd8');

                done();
            });
        });
    });
    describe ('Driver Quota  Validation Tests:\n', function () {
        describe ('Negative Tests for Driver Quota:\n', function () {
            it('should fail if non-numeric characters are assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = '58d3f839936b0405bcda9bd8';
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal('58d3f839936b0405bcda9bd8');
                expect(error.errors.driverQuota.name).to.equal('CastError');
                expect(error.errors.driverQuota.message).to.equal('Cast to Number failed for value "58d3f839936b0405bcda9bd8" at path "driverQuota"');

                done();
            });
            it('should fail if nothing is assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal(undefined);
                expect(error.errors.driverQuota.name).to.equal('ValidatorError');
                expect(error.errors.driverQuota.message).to.equal('You must select the number of drivers needed.');

                done();
            });
            it('should fail if the empty string is assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = '';
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal(null);
                expect(error.errors.driverQuota.name).to.equal('ValidatorError');
                expect(error.errors.driverQuota.message).to.equal('You must select the number of drivers needed.');

                done();
            });
            it('should fail if spaces are assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = '  ';
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal(0);
                expect(error.errors.driverQuota.name).to.equal('ValidatorError');
                expect(error.errors.driverQuota.message).to.equal('Path `driverQuota` (0) is less than minimum allowed value (1).');

                done();
            });
            it('should fail if non-integer negative numeric value is assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = -34.45;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal(-34.45);
                expect(error.errors.driverQuota.name).to.equal('ValidatorError');
                expect(error.errors.driverQuota.message).to.equal('Path `driverQuota` (-34.45) is less than minimum allowed value (1).');

                done();
            });
            it('should fail if an integer negative numeric value is assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = -3;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal(-3);
                expect(error.errors.driverQuota.name).to.equal('ValidatorError');
                expect(error.errors.driverQuota.message).to.equal('Path `driverQuota` (-3) is less than minimum allowed value (1).');

                done();
            });
            it('should fail if an non-integer positive numeric value is assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = 24.45;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal(24.45);
                expect(error.errors.driverQuota.name).to.equal('ValidatorError');
                expect(error.errors.driverQuota.message).to.equal('24.45 must be a whole number (integer) greater than 0.');

                done();
            });
            it('should fail if zero (0) is assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = 0;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.driverQuota).to.exist;
                expect(error.errors.driverQuota.value).to.equal(0);
                expect(error.errors.driverQuota.name).to.equal('ValidatorError');
                expect(error.errors.driverQuota.message).to.equal('Path `driverQuota` (0) is less than minimum allowed value (1).');

                done();
            });
        });
        describe ('Positive Tests for Driver Quota:\n', function () {
            it('should pass if a positive integer greater than 0 is assigned to driverQuota', function (done){
                var trip = new Trip ();
                var error;

                trip.driverQuota = 5;
                error = trip.validateSync();

                expect(error.errors.driverQuota).to.not.exist;
                expect(trip.driverQuota).to.equal(5);

                done();
            });

        });
    });
    describe ('Trip Start  Validation Tests:\n', function () {
        describe ('Negative Tests for Trip Start:\n', function () {
            it ('should fail if no Trip Start is provided', function (done) {
                var trip = new Trip ();
                var error;

                trip.tripStart;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.tripStart).to.exist;
                expect(error.errors.tripStart.value).to.be.undefined;
                expect(error.errors.tripStart.name).to.equal('ValidatorError');
                expect(error.errors.tripStart.message).to.equal('Trip Start Date and Start Time are required.');

                done();
            });
            it ('should fail if an invalid trip start date is provided', function (done) {
                var trip = new Trip ();
                var error;

                trip.tripStart = 'bananas in spring time';
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.tripStart).to.exist;
                expect(error.errors.tripStart.value).to.equal('bananas in spring time');
                expect(error.errors.tripStart.name).to.equal('CastError');
                expect(error.errors.tripStart.message).to.equal('Cast to Date failed for value "bananas in spring time" at path "tripStart"');

                done();
            });
            it ('should pass if a date before today is assigned to start date (changes to today\'s date', function (done) {
                var trip = new Trip ();
                var error;

                trip.tripStart = new Date(1776, 6, 4, 5);
                error = trip.validateSync();

                expect(error.errors.tripStart).to.not.exist;
                expect(trip.tripStart).to.be.instanceof(Date);


                done();
            });
        });
        describe ('Positive Tests for Trip Start:\n', function () {
            it ('should pass if a valid date is supplied', function (done){
                var trip = new Trip ();
                var error;

                trip.tripStart = new Date(2017, 3, 26, 5);
                error = trip.validateSync();

                expect(error.errors.tripStart).to.not.exist;
                expect(trip.tripStart).to.be.instanceof(Date);

                done();
            });
        });
    });
    describe ('Available Drivers Validation Tests:\n', function () {
        describe ('Negative Tests for Available Drivers:\n', function () {
            it ('should fail if no value for availableDrivers is provided', function (done){
                var trip = new Trip ();
                var error;

                trip.availableDrivers;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.availableDrivers).to.exist;
                expect(error.errors.availableDrivers.value).to.be.empty;
                expect(error.errors.availableDrivers.value).to.be.an.array;
                expect(error.errors.availableDrivers.name).to.equal('ValidatorError');
                expect(error.errors.availableDrivers.message).to.equal('At least one driver is required.');

                done();
            });
            it ('should fail if an empty string is assigned to availableDrivers', function (done){
                var trip = new Trip ();
                var error;

                trip.availableDrivers = '';
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.availableDrivers).to.exist;
                expect(error.errors.availableDrivers.value).to.equal('');
                expect(error.errors.availableDrivers.name).to.equal('CastError');
                expect(error.errors.availableDrivers.message).to.equal('Cast to Array failed for value "" at path "availableDrivers"');

                done();
            });

            it ('should fail if an spaces are assigned to availableDrivers', function (done){
                var trip = new Trip ();
                var error;

                trip.availableDrivers = '  ';
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.availableDrivers).to.exist;
                expect(error.errors.availableDrivers.value).to.equal('  ');
                expect(error.errors.availableDrivers.name).to.equal('CastError');
                expect(error.errors.availableDrivers.message).to.equal('Cast to Array failed for value "  " at path "availableDrivers"');

                done();
            });
        });
        describe ('Positive Tests for Available Drivers:\n', function () {
            it ('should pass if a valid driver ObjectId is assigned', function (done){
                var trip = new Trip ();
                var error;

                trip.availableDrivers.push('58d3f839936b0405bcda9bd6');
                error = trip.validateSync();

                expect(error.errors.availableDrivers).to.not.exist;
                expect(trip.availableDrivers.toString()).to.equal('58d3f839936b0405bcda9bd6');

                done();
            });
        });
    });
    describe ('Responses Validation Tests:\n', function () {
        describe ('Yes Accepted Responses Validation Tests:\n', function () {
            describe ('Negative Tests for yesAccepted Responses', function (){
                it ('should fail if an empty string is assigned to responses.yesAccepted', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.yesAccepted = '';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.yesAccepted']).to.exist;
                    expect(error.errors['responses.yesAccepted'].value).to.equal('');
                    expect(error.errors['responses.yesAccepted'].name).to.equal('CastError');
                    expect(error.errors['responses.yesAccepted'].message).to.equal('Cast to Array failed for value "" at path "responses.yesAccepted"');

                    done();
                });

                it ('should fail if an spaces are assigned to responses.yesAccepted', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.yesAccepted = '  ';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.yesAccepted']).to.exist;
                    expect(error.errors['responses.yesAccepted'].value).to.equal('  ');
                    expect(error.errors['responses.yesAccepted'].name).to.equal('CastError');
                    expect(error.errors['responses.yesAccepted'].message).to.equal('Cast to Array failed for value "  " at path "responses.yesAccepted"');

                    done();
                });
            });
            describe ('Positive Tests for yesAccepted Responses', function (){
                it('should pass if a driver ObjectId is pushed into the yesAccepted array', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.yesAccepted.push('58d3f839936b0405bcda9bd6');
                    error = trip.validateSync();

                    expect(error.errors['responses.yesAccepted']).to.not.exist;
                    expect(trip.responses.yesAccepted.toString()).to.equal('58d3f839936b0405bcda9bd6');

                    done();
                });
            });
        });
        describe ('Yes Rejected Responses Validation Tests:\n', function () {
            describe ('Negative Tests for yesRejected Responses', function (){
                it ('should fail if an empty string is assigned to responses.yesRejected', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.yesRejected = '';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.yesRejected']).to.exist;
                    expect(error.errors['responses.yesRejected'].value).to.equal('');
                    expect(error.errors['responses.yesRejected'].name).to.equal('CastError');
                    expect(error.errors['responses.yesRejected'].message).to.equal('Cast to Array failed for value "" at path "responses.yesRejected"');

                    done();
                });

                it ('should fail if an spaces are assigned to responses.yesRejected', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.yesRejected = '  ';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.yesRejected']).to.exist;
                    expect(error.errors['responses.yesRejected'].value).to.equal('  ');
                    expect(error.errors['responses.yesRejected'].name).to.equal('CastError');
                    expect(error.errors['responses.yesRejected'].message).to.equal('Cast to Array failed for value "  " at path "responses.yesRejected"');

                    done();
                });
            });
            describe ('Positive Tests for yesRejected Responses', function (){
                it('should pass if a driver ObjectId is pushed into the yesRejected array', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.yesRejected.push('58d3f839936b0405bcda9bd6');
                    error = trip.validateSync();

                    expect(error.errors['responses.yesRejected']).to.not.exist;
                    expect(trip.responses.yesRejected.toString()).to.equal('58d3f839936b0405bcda9bd6');

                    done();
                });
            });
        });
        describe ('Declined Responses Validation Tests:\n', function () {
            describe ('Negative Tests for declined Responses', function (){
                it ('should fail if an empty string is assigned to responses.declined', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.declined = '';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.declined']).to.exist;
                    expect(error.errors['responses.declined'].value).to.equal('');
                    expect(error.errors['responses.declined'].name).to.equal('CastError');
                    expect(error.errors['responses.declined'].message).to.equal('Cast to Array failed for value "" at path "responses.declined"');

                    done();
                });

                it ('should fail if an spaces are assigned to responses.declined', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.declined = '  ';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.declined']).to.exist;
                    expect(error.errors['responses.declined'].value).to.equal('  ');
                    expect(error.errors['responses.declined'].name).to.equal('CastError');
                    expect(error.errors['responses.declined'].message).to.equal('Cast to Array failed for value "  " at path "responses.declined"');

                    done();
                });
            });
            describe ('Positive Tests for declined Responses', function (){
                it('should pass if a driver ObjectId is pushed into the declined array', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.declined.push('58d3f839936b0405bcda9bd6');
                    error = trip.validateSync();

                    expect(error.errors['responses.declined']).to.not.exist;
                    expect(trip.responses.declined.toString()).to.equal('58d3f839936b0405bcda9bd6');

                    done();
                });
            });
        });
        describe ('No Response Validation Tests:\n', function () {
            describe ('Negative Tests for noResponse responses', function (){
                it ('should fail if an empty string is assigned to responses.noResponse', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.noResponse = '';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.noResponse']).to.exist;
                    expect(error.errors['responses.noResponse'].value).to.equal('');
                    expect(error.errors['responses.noResponse'].name).to.equal('CastError');
                    expect(error.errors['responses.noResponse'].message).to.equal('Cast to Array failed for value "" at path "responses.noResponse"');

                    done();
                });

                it ('should fail if an spaces are assigned to responses.noResponse', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.noResponse = '  ';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['responses.noResponse']).to.exist;
                    expect(error.errors['responses.noResponse'].value).to.equal('  ');
                    expect(error.errors['responses.noResponse'].name).to.equal('CastError');
                    expect(error.errors['responses.noResponse'].message).to.equal('Cast to Array failed for value "  " at path "responses.noResponse"');

                    done();
                });
            });
            describe ('Positive Tests for noResponse responses', function (){
                it('should pass if a driver ObjectId is pushed into the noResponse array', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.responses.noResponse.push('58d3f839936b0405bcda9bd6');
                    error = trip.validateSync();

                    expect(error.errors['responses.noResponse']).to.not.exist;
                    expect(trip.responses.noResponse.toString()).to.equal('58d3f839936b0405bcda9bd6');

                    done();
                });

            });
        });
    });
    describe ('Response Deadline Validation Tests:\n', function () {
        describe ('Negative Tests for Response Deadline:\n', function () {
            it ('should fail if no Response Deadline is provided', function (done) {
                var trip = new Trip ();
                var error;

                trip.responseDeadline;
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.responseDeadline).to.exist;
                expect(error.errors.responseDeadline.value).to.be.undefined;
                expect(error.errors.responseDeadline.name).to.equal('ValidatorError');
                expect(error.errors.responseDeadline.message).to.equal('Response Deadline is required!');

                done();
            });
            it ('should fail if an invalid trip start date is provided', function (done) {
                var trip = new Trip ();
                var error;

                trip.responseDeadline = 'bananas in spring time';
                error = trip.validateSync();

                expect(error.name).to.exist;
                expect(error.name).to.equal('ValidationError');
                expect(error.message).to.equal('Trip validation failed');
                expect(error.errors.responseDeadline).to.exist;
                expect(error.errors.responseDeadline.value).to.equal('bananas in spring time');
                expect(error.errors.responseDeadline.name).to.equal('CastError');
                expect(error.errors.responseDeadline.message).to.equal('Cast to Date failed for value "bananas in spring time" at path "responseDeadline"');

                done();
            });
        });
        describe ('Positive Tests for Response Deadline:\n', function () {
            it ('should pass if a valid date is supplied', function (done){
                var trip = new Trip ();
                var error;

                trip.responseDeadline = new Date(2017, 3, 26, 5);
                error = trip.validateSync();

                expect(error.errors.responseDeadline).to.not.exist;
                expect(trip.responseDeadline).to.be.instanceof(Date);

                done();
            });
        });
    });
    describe ('Messages Validation Tests:\n', function () {
        describe ('Driver Request Message Validation Tests:\n', function () {
            describe ('Negative Tests for Driver Request Message:\n', function () {
                it ('should fail if no value for driver request message is provided', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.driverRequest;
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.driverRequest']).to.exist;
                    expect(error.errors['messages.driverRequest'].value).to.equal(undefined);
                    expect(error.errors['messages.driverRequest'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.driverRequest'].message).to.equal('Driver request message is required.');

                    done();
                });
                it('should fail if an empty string is assigned to driverRequest message', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.driverRequest = '';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.driverRequest']).to.exist;
                    expect(error.errors['messages.driverRequest'].value).to.equal('');
                    expect(error.errors['messages.driverRequest'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.driverRequest'].message).to.equal('Driver request message is required.');

                    done();
                });

                it('should fail if spaces are assigned to driverRequest message', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.driverRequest = '  ';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.driverRequest']).to.exist;
                    expect(error.errors['messages.driverRequest'].value).to.equal('  ');
                    expect(error.errors['messages.driverRequest'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.driverRequest'].message).to.equal('Validator failed for path `messages.driverRequest` with value `  `');

                    done();
                });
            });
            describe ('Positive Tests for Driver Request Message:\n', function () {
                it('should pass if a message is provided to driverRequest message', function (done) {
                    var trip = new Trip ();
                    var error;

                    trip.messages.driverRequest = 'Can you drive to TUl today at 12:30?'
                                                    + ' Respond: 1=YES or 2=NO by 12:00 today.';
                    error = trip.validateSync();


                    expect(error.errors['messages.driverRequest']).to.not.exist;
                    expect(trip.messages.driverRequest).to.equal('Can you drive to TUl today at 12:30? Respond: 1=YES or 2=NO by 12:00 today.');

                    done();
                });
            });
        });
        describe ('Confirmation Accepted Message Validation Tests:\n', function () {
            describe ('Negative Tests for Confirmation Accepted Message:\n', function () {
                it ('should fail if no value for Confirmation Accepted message is provided', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationAccepted;
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.confirmationAccepted']).to.exist;
                    expect(error.errors['messages.confirmationAccepted'].value).to.equal(undefined);
                    expect(error.errors['messages.confirmationAccepted'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.confirmationAccepted'].message).to.equal('Confirmation message to drivers who accepted and are assigned to the trip is required.');

                    done();
                });
                it('should fail if an empty string is assigned to confirmationAccepted message', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationAccepted = '';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.confirmationAccepted']).to.exist;
                    expect(error.errors['messages.confirmationAccepted'].value).to.equal('');
                    expect(error.errors['messages.confirmationAccepted'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.confirmationAccepted'].message).to.equal('Confirmation message to drivers who accepted and are assigned to the trip is required.');

                    done();
                });

                it('should fail if spaces are assigned to confirmationAccepted message', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationAccepted = '  ';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.confirmationAccepted']).to.exist;
                    expect(error.errors['messages.confirmationAccepted'].value).to.equal('  ');
                    expect(error.errors['messages.confirmationAccepted'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.confirmationAccepted'].message).to.equal('Validator failed for path `messages.confirmationAccepted` with value `  `');

                    done();
                });
            });
            describe ('Positive Tests for Confirmation Accepted Message:\n', function () {
                it('should pass if a message is provided to confirmationAccepted message', function (done) {
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationAccepted = 'CONFIRMED ASSIGNED: TUL today at 12:30. Call 479-999-9999 if your plans change.';
                    error = trip.validateSync();


                    expect(error.errors['messages.confirmationAccepted']).to.not.exist;
                    expect(trip.messages.confirmationAccepted).to.equal('CONFIRMED ASSIGNED: TUL today at 12:30. Call 479-999-9999 if your plans change.');

                    done();
                });
            });
        });
        describe ('Confirmation Rejected Message Validation Tests:\n', function () {
            describe ('Negative Tests for Confirmation Rejected Message:\n', function () {
                it ('should fail if no value for Confirmation Rejected message is provided', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationRejected;
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.confirmationRejected']).to.exist;
                    expect(error.errors['messages.confirmationRejected'].value).to.equal(undefined);
                    expect(error.errors['messages.confirmationRejected'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.confirmationRejected'].message).to.equal('Confirmation message to drivers who accepted trip but are not assigned to the trip is required.');

                    done();
                });
                it('should fail if an empty string is assigned to confirmationRejected message', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationRejected = '';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.confirmationRejected']).to.exist;
                    expect(error.errors['messages.confirmationRejected'].value).to.equal('');
                    expect(error.errors['messages.confirmationRejected'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.confirmationRejected'].message).to.equal('Confirmation message to drivers who accepted trip but are not assigned to the trip is required.');

                    done();
                });

                it('should fail if spaces are assigned to confirmationRejected message', function (done){
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationRejected = '  ';
                    error = trip.validateSync();

                    expect(error.name).to.exist;
                    expect(error.name).to.equal('ValidationError');
                    expect(error.message).to.equal('Trip validation failed');
                    expect(error.errors['messages.confirmationRejected']).to.exist;
                    expect(error.errors['messages.confirmationRejected'].value).to.equal('  ');
                    expect(error.errors['messages.confirmationRejected'].name).to.equal('ValidatorError');
                    expect(error.errors['messages.confirmationRejected'].message).to.equal('Validator failed for path `messages.confirmationRejected` with value `  `');

                    done();
                });
            });
            describe ('Positive Tests for Confirmation Rejected Message:\n', function () {
                it('should pass if a message is provided to confirmationRejected message', function (done) {
                    var trip = new Trip ();
                    var error;

                    trip.messages.confirmationRejected = 'DECLINED-UNASSIGNED for TUL 12:30 trip. Driver Quota met and/or response deadline expired.'
                                                        + ' Do not respond to this message. Call 479-XXX-XXXX for inquiries.';
                    error = trip.validateSync();


                    expect(error.errors['messages.confirmationRejected']).to.not.exist;
                    expect(trip.messages.confirmationRejected).to.equal('DECLINED-UNASSIGNED for TUL 12:30 trip. Driver Quota met and/or response deadline expired. Do not respond to this message. Call 479-XXX-XXXX for inquiries.');

                    done();
                });
            });
        });
    });
    describe ('Trip Status Validation Tests:\n', function () {
        describe ('Negative Tests for Trip Status:\n', function () {
            it ('should error if no status is provided', function (done){
                var trip = new Trip ();
                var error;

                trip.status;
                error = trip.validateSync();

                expect(error.errors.status).to.exist;
                expect(error.errors.status.message).to.equal('Trip status is required.');

                done();
            });
            it ('should error if an empty string is assigned to the status', function (done){
                var trip = new Trip ();
                var error;

                trip.status = '';
                error = trip.validateSync();

                expect(error.errors.status).to.exist;
                expect(error.errors.status.message).to.equal('Trip status is required.');

                done();
            });
            it ('should error if an erroneous status is assigned to the status', function (done){
                var trip = new Trip ();
                var error;

                trip.status = 'MELLONS';
                error = trip.validateSync();

                expect(error.errors.status).to.exist;
                expect(error.errors.status.message).to.equal('Validator failed for path `status` with value `MELLONS`');

                done();
            });
        });
        describe ('Positive Tests for Trip Status:\n', function () {
            it('should pass if "blank" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'blank';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('blank');

                done();
            });
            it('should pass if "BLANK" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'BLANK';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('BLANK');

                done();
            });
            it('should pass if "pending" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'pending';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('pending');

                done();
            });
            it('should pass if "PENDING" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'PENDING';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('PENDING');

                done();
            });
            it('should pass if "complete" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'complete';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('complete');

                done();
            });
            it('should pass if "COMPLETE" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'COMPLETE';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('COMPLETE');

                done();
            });
            it('should pass if "incomplete" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'incomplete';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('incomplete');

                done();
            });
            it('should pass if "INCOMPLETE" is supplied as the status', function (done) {
                var trip = new Trip ();
                var error;

                trip.status = 'INCOMPLETE';
                error = trip.validateSync();

                expect(error.errors.status).to.not.exist;
                expect(trip.status).to.equal('INCOMPLETE');

                done();
            });
        });
    });
});
