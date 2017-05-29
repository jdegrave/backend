
var chai = require ('chai');
var expect = chai.expect;
var chaiDateTime = require('chai-datetime');
var assertArrays = require('chai-arrays');
var assertIntegers = require('chai-integer');

chai.use(assertArrays);
chai.use(assertIntegers);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Driver = require('../models/driver.model');


describe.skip('Driver schema validation tests on save or creating documents\n', function (){
    describe ('Driver First Name validation tests\n', function (){
        describe ('Negative tests for Driver first name:\n', function () {
            it ('should return an error when an empty string is provided', function (done) {
                var driver = new Driver ();
                var error;

                driver.firstName = '';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['firstName'].message).to.equal('First name is required.');
                done();
            });

            it ('should return an error when non-alpha or non-space characters are provided', function (done){
                var driver = new Driver ();
                var error;

                driver.firstName = '9495&&&66tyr//88**$%^';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['firstName'].message).to.equal('9495&&&66tyr//88**$%^ is not a valid first name!');

                done();

            });

            it ('should return an error if only spaces are provided', function (done){
                var driver = new Driver ();
                var error;
                driver.firstname = '  ';

                error = driver.validateSync();
                expect(error).to.exist;
                expect(error.errors['firstName'].message).to.equal('First name is required.');
                done();
            });


            it ('should return an error if the maximum length for first name is exceeded', function (done){
                var driver = new Driver ();
                var error;
                driver.firstName = 'Supercalifragilisticexpealadocious';

                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['firstName'].message).to.equal('Supercalifragilisticexpealadocious exceeds the maximum length permitted (25) for first names.');
                done();
            });
        });
        describe('Positive tests for Driver first name:\n', function (){
            it('should return no errors for a first name of one letter (uppercase)', function (done){
                var driver = new Driver();
                var error;
                driver.firstName = 'Z';

                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['firstName']).to.equal(undefined);
                expect(driver.firstName).to.equal('Z');
                done();
            });

            it ('should return no errors for a first name of one letter (lowercase)', function (done){
                var driver = new Driver();
                var error;

                driver.firstName = 'q';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['firstName']).to.equal(undefined);
                expect(driver.firstName).to.equal('q');

                done();
            });

            it ('should return no errors for a first name with a space in it', function (done){
                var driver = new Driver();
                var error;

                driver.firstName = 'Mary Ann';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['firstName']).to.equal(undefined);
                expect(driver.firstName).to.equal('Mary Ann');

                done();
            });

            it ('should return no errors for a first name with a hyphen in it', function (done){
                var driver = new Driver();
                var error;

                driver.firstName = 'Banana-Rama';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['firstName']).to.equal(undefined);
                expect(driver.firstName).to.equal('Banana-Rama');

                done();
            });
        });
    });
    describe('Driver Last Name validation tests', function (){
        describe('Negative tests for Driver last name:\n', function (){
            it('should have an error if an empty string is provided', function (done){
                var driver = new Driver;
                var error;

                driver.lastName = '';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['lastName'].message).to.equal('Last name is required.');

                done();
            });

            it('should have an error if non-alpha or non-alpha plus white space characters are provided', function (done){
                var driver = new Driver;
                var error;

                driver.lastName = '  ^&**#hfuUYG fjf!@@2!~';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['lastName'].message).to.equal('  ^&**#hfuUYG fjf!@@2!~ is not a valid last name!');

                done();
            });

            it('should have an error if only white space is provided', function (done){
                var driver = new Driver ();
                var error;

                driver.firstname = '  ';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['lastName'].message).to.equal('Last name is required.');

                done();
            });

            it('should have an error if the maximum length for last names is exceeded', function (done){
                var driver = new Driver();
                var error;

                driver.lastName = 'SomewhereovertherainbowbluebirdsflywhyohwhycantI';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['lastName'].message).to.equal('SomewhereovertherainbowbluebirdsflywhyohwhycantI'
                                                                + ' exceeds the maximum length permitted (45) for last names.');
                done();
            });
        });
        describe('Positive tests for Driver last name:\n', function () {
            it('should pass without error if lastName has 1 alpha character (uppercase)', function (done){
                var driver = new Driver();
                var error;

                driver.lastName = 'F';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['lastName']).to.equal(undefined);
                expect(driver.lastName).to.equal('F');

                done();
            });

            it('should pass without error if lastName as 1 alpha character (lowercase)', function (done){
                var driver = new Driver();
                var error;

                driver.lastName = 'c';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['lastName']).to.equal(undefined);
                expect(driver.lastName).to.equal('c');

                done();
            });

            it ('should pass without error if lastName has a space in it', function (done){
                var driver = new Driver();
                var error;

                driver.lastName = 'De Grave';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['lastName']).to.equal(undefined);
                expect(driver.lastName).to.equal('De Grave');

                done();
            });

            it ('should pass without error if lastName has a hyphen in it', function (done){
                var driver = new Driver();
                var error;

                driver.lastName = 'Huntington-Jones';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['lastName']).to.equal(undefined);
                expect(driver.lastName).to.equal('Huntington-Jones');

                done();
            });

        });
    });
    describe('Driver Mobile Phone validation tests\n', function () {
        describe('Negative tests for Driver mobile phone:\n', function () {
            it('should have an error if characters are not numeric', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = 'abc-abc-defg';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('abc-abc-defg is not a valid phone number. Expected format is 123-456-6789');

                done();
            });

            it('should have an error if the phone has 10 digits but no dashes', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '00123456789';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('00123456789 is not a valid phone number. Expected format is 123-456-6789');

                done();
            });

            it('should have an error if an empty string is passed as the mobile phone number', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('Mobile phone number is required.');

                done();
            });

            it('should have an error if less than 10 digits are passed with dashes', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '123-456-888';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('123-456-888 is not a valid phone number. Expected format is 123-456-6789');

                done();
            });

            it('should have an error if less than 10 digits are passed without dashes', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '1234567';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('1234567 is not a valid phone number. Expected format is 123-456-6789');

                done();
            });

            it('should have an error if 10 digits are passed but dashes are in the wrong place', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '123-45-67890';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('123-45-67890 is not a valid phone number. Expected format is 123-456-6789');

                done();
            });

            it('should have an error if 10 digits are passed but parentheses, spaces, and dashes are present', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '(123) 456-7890';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('(123) 456-7890 exceeds the maximum length permitted (12) for phone numbers. Format is: 123-345-6789');

                done();
            });

            it ('should have an error if more than 10 digits are passed with dashes', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '123-456-78909585985';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('123-456-78909585985 exceeds the maximum length permitted (12) for phone numbers. Format is: 123-345-6789');

                done();
            });

            it ('should have an error if more than 10 digits are passed without dashes', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '12345678909585985';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('12345678909585985 exceeds the maximum length permitted (12) for phone numbers. Format is: 123-345-6789');

                done();
            });

            it ('should have an error if more than 10 digits are passed with spaces', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '123 456 7890 958 5985';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('123 456 7890 958 5985 exceeds the maximum length permitted (12) for phone numbers. Format is: 123-345-6789');

                done();
            });

            it ('should have an error if more than 10 digits are passed with periods', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '123.456.7890.958.5985';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('123.456.7890.958.5985 exceeds the maximum length permitted (12) for phone numbers. Format is: 123-345-6789');

                done();
            });

            it ('should have an error if more than 10 digits are passed with parentheses, spaces, and dashes', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '(123) 456-7890 958-5985';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['mobilePhone'].message).to.equal('(123) 456-7890 958-5985 exceeds the maximum length permitted (12) for phone numbers. Format is: 123-345-6789');

                done();
            });
        });
        describe('Positive tests for Driver mobile phone:\n', function (){
            it('should pass with no errors for a phone number in proper format', function (done){
                var driver = new Driver();
                var error;

                driver.mobilePhone = '123-456-7890';
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['mobilePhone']).to.equal(undefined);
                expect(driver.mobilePhone).to.equal('123-456-7890');

                done();
            });
        });
    });
    describe('Driver Available tests\n', function (){
        describe('Negative tests for Driver available:\n', function (){

            it('should assign true when "available" property has an alpha non-Boolean value', function (done){
                var driver = new Driver();
                var error;

                driver.available = 'banana';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(driver.available).to.not.be.an.instanceof(Boolean);
                expect(driver.avaialable).to.not.equal('banana');
                expect(driver.available).to.be.true;

                done();
            });

            it('should assign true when available property has a numeric non-Boolean value', function (done){
                var driver = new Driver();
                var error;

                driver.available = 304;
                error = driver.validateSync();


                expect(error).to.exist;
                expect(driver.available).to.not.be.an.instanceof(Boolean);
                expect(driver.available).to.not.equal(304);
                expect(driver.available).to.equal(true);

                done();
            });

            it('should assign false when an empty string is assigned to the "available" property', function (done){
                var driver = new Driver();
                var error;

                driver.available = '';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(driver.available).to.be.an.boolean();
                expect(driver.available).to.not.equal('');
                expect(driver.available).to.equal(false);

                done();
            });

        });
        it('should have a default of true if no value for "available" property is supplied', function (done){
            var driver = new Driver();
            var error;

            driver.available;
            error = driver.validateSync();

            console.log('driver available: ', driver.available);
            expect(error).to.equal.undefined;
            expect(driver.available).to.equal(true);
            expect(driver.available).to.be.a.boolean();

            done();
        });
        describe('Positive tests for Driver available:\n', function (){
            it('should have a value of true (Boolean) if true is assigned', function (done){
                var driver = new Driver();
                var error;

                driver.available = true;
                error = driver.validateSync();


                expect(error.errors['available']).to.not.exist;
                expect(driver.available).to.equal(true);
                expect(driver.available).to.be.a.boolean();

                done();
            });
            it('should have a value of false (Boolean) if false is assigned', function (done){
                var driver = new Driver();
                var error;

                driver.available = false;
                error = driver.validateSync();


                expect(error.errors['available']).to.not.exist;
                expect(driver.available).to.equal(false);
                expect(driver.available).to.be.a('boolean');


                done();
            });
        });
    });
    describe('Driver Seniority Rank validation tests:\n', function (){
        describe('Negative tests for Driver seniorty rank:\n', function (){
            it('it should produce an error if a non-numeric value is assigned to seniorityRank', function(done){
                var driver = new Driver();
                var error;

                driver.seniorityRank = 'Alphabet soup%$$!!';
                error = driver.validateSync();

                expect(error).to.exist;
                expect(error.errors['seniorityRank']).to.exist;
                expect(error.errors['seniorityRank'].message).to.exist;
                expect(error.errors['seniorityRank'].message).to.equal('Cast to Number failed for value "Alphabet soup%$$!!" at path "seniorityRank"');

                done();
            });

            it('should produce an error if empty string is assigned to seniorityRank', function(done){
                var driver = new Driver();
                var error;

                driver.seniorityRank = '';
                error = driver.validateSync();


                expect(error).to.exist;
                expect(error.errors['seniorityRank']).to.exist;
                expect(error.errors['seniorityRank'].message).to.exist;
                expect(error.errors['seniorityRank'].message).to.equal('You must provide a valid whole number (integer) greater than 0');

                done();
            });
            it('should create an error if a non-integer is assigned to seniorityRank', function (done){
                var driver = new Driver();
                var error;

                driver.seniorityRank = 30.234;
                error = driver.validateSync();


                expect(error).to.exist;
                expect(driver.seniorityRank).to.not.be.an.integer();
                expect(error.errors['seniorityRank']).to.exist;
                expect(error.errors['seniorityRank'].message).to.exist;
                expect(error.errors['seniorityRank'].message).to.equal('Validator failed for path `seniorityRank` with value `30.234`');

                done();
            });
            it('should create an error if a number < 1 is assigned to seniorityRank', function (done){
                var driver = new Driver();
                var error;

                driver.seniorityRank = 0;
                error = driver.validateSync();


                expect(error).to.exist;
                expect(driver.seniorityRank).to.equal(0);
                expect(error.errors['seniorityRank']).to.exist;
                expect(error.errors['seniorityRank'].message).to.exist;
                expect(error.errors['seniorityRank'].message).to.equal('Path `seniorityRank` (0) is less than minimum allowed value (1).');

                done();
            });

            it('should assign the default value of 100 if no value is assigned to seniorityRank', function(done){
                var driver = new Driver();
                var error;

                driver.seniorityRank;
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(driver.seniorityRank).to.equal(100);

                done();
            });
        });
        describe('Positive tests for Driver seniority rank:\n', function(){
            it('should assign the number 20 to seniorityRank', function(done){
                var driver = new Driver();
                var error;

                driver.seniorityRank = 20;
                error = driver.validateSync();

                expect(error).to.equal.null;
                expect(driver.seniorityRank).to.equal(20);

                done();
            });

        });
    });
    describe('Driver Schedule Note validation tests:\n', function(){
        describe('Negative tests for Driver schedule note:\n ', function (){
            it ('should not have a note if nothing is entered\n', function (done){
                var driver = new Driver ();
                var error;

                driver.scheduleNote;
                error = driver.validateSync();

                expect(error.errors['scheduleNote']).to.not.exist;
                done();
            });
        });
        describe('Positive tests for Driver schedule note:\n ', function (){
            it('should accept 0 or more characters', function (done){
                var driver = new Driver();
                var error;

                driver.scheduleNote.note = 'This is my schedule note! I\'m not working today!';
                error = driver.validateSync();


                //expect(driver.scheduleNote).to.include.keys('createDate');
                expect(driver.scheduleNote).to.include.keys('note');
                //expect(driver.scheduleNote.createDate).to.be.a.dateString();
                expect(driver.scheduleNote.note).to.equal('This is my schedule note! I\'m not working today!');

                done();
            });
        });
    });
    describe('Driver First to Text validation tests:\n', function (req, res){
        describe('Negative tests for first to text\n', function (req, res){
            it('should provide a default value of false when nothing is provided', function (done){
                var driver = new Driver();
                var error;

                driver.firstToText;
                error = driver.validateSync();

                expect(driver.firstToText).to.be.false;
                expect(driver.firstToText).to.be.a('boolean');
                expect(driver.firstToText).to.equal.false;

                done();
            });
            it('should have a value of false if an empty string is provided', function (done){
                var driver = new Driver()
                var error;

                driver.firstToText = '';
                error = driver.validateSync();

                expect(driver.firstToText).to.be.false;
                expect(driver.firstToText).to.be.a('boolean');
                expect(driver.firstToText).to.equal.false;
                expect(driver.firstToText).to.not.equal('');
                expect(error.errors['firstToText']).to.be.undefined;


                done();
            });
        });
        describe('Positive tests for first to text:\n', function (){
            it('should have a value of false (boolean) if false is assigned', function (done){
                var driver = new Driver()
                var error;

                driver.firstToText = false;
                error = driver.validateSync();

                expect(driver.firstToText).to.be.false;
                expect(driver.firstToText).to.be.a('boolean');
                expect(driver.firstToText).to.equal.false;
                expect(error.errors['firstToText']).to.be.undefined;

                done();
            });
            it('should have a value of true (Boolean) if true is assigned', function (done){
                var driver = new Driver()
                var error;

                driver.firstToText = true;
                error = driver.validateSync();

                expect(driver.firstToText).to.be.true;
                expect(driver.firstToText).to.be.a('boolean');
                expect(driver.firstToText).to.equal.true;
                expect(error.errors['firstToText']).to.be.undefined;

                done();
            });
        });
    });
    describe('Driver Text capability validation tests:\n ', function (){
        describe('Negative tests for Driver text capability\n', function (){
            it ('should have a value of true (Boolean) if a non-Boolean alpha string is provided', function (done){
                var driver = new Driver();
                var error;

                driver.text = 'whatever0e93$%AA';
                error = driver.validateSync();


                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.true;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(true);


                done();
            });
            it ('should have a value of false (Boolean) if a numeric 0 (zero) value is provided', function (done){
                var driver = new Driver();
                var error;

                driver.text = 0;
                error = driver.validateSync();


                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.false;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(false);


                done();
            });
            it ('should have a value of false (Boolean) if a the string "0" (zero) is provided', function (done){
                var driver = new Driver();
                var error;

                driver.text = '0';
                error = driver.validateSync();


                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.false;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(false);

                done();
            });
            it ('should have a value of false (Boolean) if the string "false" is provided', function (done){
                var driver = new Driver();
                var error;

                driver.text = 'false';
                error = driver.validateSync();


                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.false;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(false);

                done();
            });
            it ('should have a value of false (Boolean) if a the empty string is provided', function (done){
                var driver = new Driver();
                var error;

                driver.text = '';
                error = driver.validateSync();


                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.false;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(false);

                done();
            });
            it ('should have a value of true (Boolean) if no value is provided', function (done){
                var driver = new Driver();
                var error;

                driver.text;
                error = driver.validateSync();


                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.true;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(true);

                done();
            });
        });
        describe('Positive tests for Driver text capability', function (){
            it('should indicate false (boolean) if a false value is assigned', function (done){
                var driver = new Driver();
                var error;

                driver.text = false;
                error = driver.validateSync();

                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.false;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(false);

                done();
            });
            it('should indicate true (boolean) if a true value is assigned', function (done){
                var driver = new Driver();
                var error;

                driver.text = true;
                error = driver.validateSync();

                expect(error.errors['text']).to.not.exist;
                expect(driver.text).to.be.true;
                expect(driver.text).to.be.a('boolean');
                expect(driver.text).to.equal(true);

                done();
            });
        });
    });
    describe('Driver deleted validation tests:\n ', function (){
        describe('Negative tests for Driver deletion capability\n', function (){
            it ('should have a value of true (Boolean) if a non-Boolean alpha string is provided', function (done){
                var driver = new Driver();
                var error;

                driver.deleted = 'whatever0e93$%AA';
                error = driver.validateSync();


                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.true;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(true);


                done();
            });
            it ('should have a value of false (Boolean) if a numeric 0 (zero) value is provided', function (done){
                var driver = new Driver();
                var error;

                driver.deleted = 0;
                error = driver.validateSync();


                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.false;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(false);


                done();
            });
            it ('should have a value of false (Boolean) if a the string "0" (zero) is provided', function (done){
                var driver = new Driver();
                var error;

                driver.deleted = '0';
                error = driver.validateSync();


                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.false;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(false);

                done();
            });
            it ('should have a value of false (Boolean) if the string "false" is provided', function (done){
                var driver = new Driver();
                var error;

                driver.deleted = 'false';
                error = driver.validateSync();


                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.false;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(false);

                done();
            });
            it ('should have a value of false (Boolean) if a the empty string is provided', function (done){
                var driver = new Driver();
                var error;

                driver.deleted = '';
                error = driver.validateSync();


                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.false;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(false);

                done();
            });
            it ('should have a value of false (Boolean) if no value is provided', function (done){
                var driver = new Driver();
                var error;

                driver.deleted;
                error = driver.validateSync();


                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.false;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(false);

                done();
            });
        });
        describe('Positive tests for Driver deletion capability', function (){
            it('should indicate false (boolean) if a false value is assigned', function (done){
                var driver = new Driver();
                var error;

                driver.deleted = false;
                error = driver.validateSync();

                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.false;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(false);

                done();
            });
            it('should indicate true (boolean) if a true value is assigned', function (done){
                var driver = new Driver();
                var error;

                driver.deleted = true;
                error = driver.validateSync();

                expect(error.errors['deleted']).to.not.exist;
                expect(driver.deleted).to.be.true;
                expect(driver.deleted).to.be.a('boolean');
                expect(driver.deleted).to.equal(true);

                done();
            });
        });
    });
    describe('Driver String ObjectId validation tests:\n', function(){
        describe('Negative tests for stringObjectId:\n ', function (){
            it ('should pass if nothing is entered\n', function (done){
                var driver = new Driver ();
                var error;

                driver.stringObjectId;
                error = driver.validateSync();

                expect(error.errors['stringObjectId']).to.not.exist;
                done();
            });
        });
        describe('Positive tests for stringObjectId:\n ', function (){
            it('this will be tested under driverService.spec');
        });
    });
});
