var chai = require('chai');
var expect = chai.expect;
var assertArrays = require('chai-arrays');

chai.use(assertArrays);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Location = require('../models/location.model');

describe.skip('Location Schema Validation Tests on Save or Creating Documents\n', function (){
    describe('Location City validation tests:\n', function (){
        describe ('Negative tests for Location city:\n', function () {
            it ('should return an error when an empty string is provided', function (done) {
                var location = new Location ();
                var error;

                location.city = '';
                error = location.validateSync();

                expect(error.errors.city).to.exist;
                expect(error.errors.city.message).to.equal('City name is required.');
                done();
            });

            it ('should return an error when non-alphanumeric or non-space characters are provided', function (done){
                var location = new Location ();
                var error;

                location.city = '9495&&&66tyr//88**$%^';
                error = location.validateSync();

                expect(error.errors.city).to.exist;
                expect(error.errors['city'].message).to.equal('9495&&&66tyr//88**$%^ is not a valid city name!');

                done();

            });

            it ('should return an error if only spaces are provided', function (done){
                var location = new Location ();
                var error;

                location.city = '  ';
                error = location.validateSync();

                expect(error.errors.city).to.exist;
                expect(error.errors['city'].message).to.equal('   is not a valid city name!');

                done();
            });


            it ('should return an error if the maximum length for city name is exceeded', function (done){
                var location = new Location ();
                var error;

                location.city = 'Supercalifragilisticexpealadocious';
                error = location.validateSync();

                expect(error.errors.city).to.exist;
                expect(error.errors['city'].message).to.equal('Supercalifragilisticexpealadocious exceeds the maximum length permitted (25) for city names.');

                done();
            });

            it ('should return an error if no value is provided for city', function (done){
                var location = new Location ();
                var error;

                location.city;
                error = location.validateSync();

                expect(error.errors.city).to.exist;
                expect(error.errors['city'].message).to.equal('City name is required.');

                done();
            });
        });
        describe ('Positive tests for Location city:\n', function () {
            it('should return no errors for a city name of one letter (uppercase)', function (done){
                var location = new Location();
                var error;

                location.city = 'Z';
                error = location.validateSync();

                expect(error.errors.city).to.not.exist;
                expect(location.city).to.equal('Z');

                done();
            });

            it ('should return no errors for a city name of one letter (lowercase)', function (done) {
                var location = new Location();
                var error;

                location.city = 'q';
                error = location.validateSync();

                expect(error.errors.city).to.not.exist;
                expect(location.city).to.equal('q');

                done();
            });

            it ('should return no errors for a city name with a space in it', function (done) {
                var location = new Location();
                var error;

                location.city = 'Los Angeles';
                error = location.validateSync();

                expect(error.errors.city).to.not.exist;
                expect(location.city).to.equal('Los Angeles');

                done();
            });

            it ('should return no errors for a city name with a hyphen in it', function (done) {
                var location = new Location();
                var error;

                location.city = 'Stratford-upon-Avon';
                error = location.validateSync();

                expect(error.errors.city).to.not.exist;
                expect(location.city).to.equal('Stratford-upon-Avon');

                done();
            });

            it ('should return no errors for a city name with a number in it', function (done) {
                var location = new Location();
                var error;

                location.city = 'Downtown 7th St';
                error = location.validateSync();

                expect(error.errors.city).to.not.exist;
                expect(location.city).to.equal('Downtown 7th St');

                done();
            });
        });
    });
    describe('Location City Code validation tests:\n', function () {
        describe ('Negative tests for Location city code:\n', function () {
            it('should fail if 3 alpha characters that are not valid city codes are assigned to cityCode', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'ARF';
                error = location.validateSync();

                expect(error.errors.cityCode).to.exist;
                expect(error.errors.cityCode.message).to.exist;
                expect(error.errors['cityCode'].message).to.equal('ARF is not a valid city code. Expected 3 letter code.');

                done();
            });
            it('should fail if more than 3 numbers are assigned to cityCode', function (done){
                var location = new Location();
                var error;

                location.cityCode = 1256;
                error = location.validateSync();

                expect(error.errors.cityCode).to.exist;
                expect(error.errors.cityCode.message).to.exist;
                expect(error.errors['cityCode'].message).to.equal('1256 exceeds the maxmimum length permitted (3) for city codes.');

                done();
            });
            it('should fail if 3 numbers are assigned to cityCode', function (done){
                var location = new Location();
                var error;

                location.cityCode = 125;
                error = location.validateSync();

                expect(error.errors.cityCode).to.exist;
                expect(error.errors.cityCode.message).to.exist;
                expect(error.errors['cityCode'].message).to.equal('125 is not a valid city code. Expected 3 letter code.');

                done();
            });
            it('should fail if two numbers are assigned to cityCode', function (done){
                var location = new Location();
                var error;

                location.cityCode = 12;
                error = location.validateSync();

                expect(error.errors.cityCode).to.exist;
                expect(error.errors.cityCode.message).to.exist;
                expect(error.errors['cityCode'].message).to.equal('12 is less than the minimum length permitted (3) for city codes.');

                done();
            });
            it('should fail if an empty string is assigned to cityCode', function (done){
                var location = new Location();
                var error;

                location.cityCode = '';
                error = location.validateSync();

                expect(error.errors.cityCode).to.exist;
                expect(error.errors.cityCode.message).to.exist;
                expect(error.errors['cityCode'].message).to.equal('City Code is required.');

                done();
            });
            it('should fail if a 2-character code is assigned to city code', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'AB';
                error = location.validateSync();

                expect(error.errors['cityCode']).to.exist;
                expect(error.errors['cityCode'].message).to.equal('AB is less than the minimum length permitted (3) for city codes.');

                done();
            });
            it('should fail if numbers are assigned to city code', function (done){
                var location = new Location();
                var error;

                location.cityCode = '123';
                error = location.validateSync();

                expect(error.errors['cityCode']).to.exist;
                expect(error.errors['cityCode'].message).to.equal('123 is not a valid city code. Expected 3 letter code.');

                done();
            });
        });
        describe ('Positive tests for Location city code:\n', function () {
            it('should return no errors for city code of "FSM"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'FSM';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('FSM');
                expect(location.cityCode).to.be.a('string');

                done();
            });
            it('should return no errors for city code of "JLN"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'JLN';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('JLN');
                expect(location.cityCode).to.be.a('string');

                done();
            });
            it('should return no errors for city code of "JP6"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'JP6';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('JP6');
                expect(location.cityCode).to.be.a('string');

                done();
            });
            it('should return no errors for city code of "LCL"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'LCL';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('LCL');
                expect(location.cityCode).to.be.a('string');

                done();
            });
            it('should return no errors for city code of "OKC"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'OKC';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('OKC');
                expect(location.cityCode).to.be.a('string');

                done();
            });
            it('should return no errors for city code of "PLK"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'PLK';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('PLK');
                expect(location.cityCode).to.be.a('string');

                done();
            });
            it('should return no errors for city code of "SGF"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'SGF';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('SGF');
                expect(location.cityCode).to.be.a('string');

                done();
            });
            it('should return no errors for city code of "TUL"', function (done){
                var location = new Location();
                var error;

                location.cityCode = 'TUL';
                error = location.validateSync();

                expect(error.errors.cityCode).to.not.exist;
                expect(location.cityCode).to.equal('TUL');
                expect(location.cityCode).to.be.a('string');

                done();
            });
        });
    });

    describe('Location Active validation tests:\n', function (){
        describe ('Negative tests for Location active:\n', function () {
            it('should pass if "active" is set to nothing (assigns false)', function(done){
                var location = new Location();
                var error;

                location.active;
                error = location.validateSync();

                expect(location.active).to.equal(false);
                expect(error.errors.active).to.not.exist;
                expect(location.active).to.be.a('boolean');

                done();
            });
            it('should pass if "active" is set to alpha characters (assigns true (Boolean))', function(done){
                var location = new Location();
                var error;

                location.active = 'banana458**&%%!!@';
                error = location.validateSync();

                expect(location.active).to.equal(true);
                expect(error.errors.active).to.not.exist;
                expect(location.active).to.be.a('boolean');

                done();
            });
            it('should pass if "active" is set to empty string (assigns false (Boolean))', function(done){
                var location = new Location();
                var error;

                location.active = '';
                error = location.validateSync();

                expect(location.active).to.equal(false);
                expect(error.errors.active).to.not.exist;
                expect(location.active).to.be.a('boolean');

                done();
            });
            it('should pass if "active" is set to a negative decimal (assigns true (Boolean))', function(done){
                var location = new Location();
                var error;

                location.active = -9.558;
                error = location.validateSync();

                expect(location.active).to.equal(true);
                expect(error.errors.active).to.not.exist;
                expect(location.active).to.be.a('boolean');

                done();
            });
            it('should pass if "active" is set to a positive decimal (assigns true (Boolean))', function(done){
                var location = new Location();
                var error;

                location.active = 34;
                error = location.validateSync();

                expect(location.active).to.equal(true);
                expect(error.errors.active).to.not.exist;
                expect(location.active).to.be.a('boolean');

                done();
            });
            it('should pass if "active" is set to zero (0) (assigns false (Boolean))', function(done){
                var location = new Location();
                var error;

                location.active = 0;
                error = location.validateSync();

                expect(location.active).to.equal(false);
                expect(error.errors.active).to.not.exist;
                expect(location.active).to.be.a('boolean');

                done();
            });
        });

        describe ('Positive tests for Location active:\n', function () {
            it('should pass if "active" property is set to true (Boolean)', function(done){
                var location = new Location();
                var error;

                location.active = true;
                error = location.validateSync();

                expect(error.errors['active']).to.not.exist;
                expect(location.active).to.equal(true);
                expect(location.active).to.be.a('boolean');


                done();
            });
            it('should pass if the "active" property is set to false (Boolean)', function(done){
                var location = new Location();
                var error;

                location.active = false;
                error = location.validateSync();


                expect(error.errors.active).to.not.exist;
                expect(location.active).to.equal(false);
                expect(location.active).to.be.a('boolean');

                done();

            });
        });
    });

});
