var chai = require ('chai');
var expect = chai.expect;
var chaiDateTime = require('chai-datetime');
var assertArrays = require('chai-arrays');
var assertIntegers = require('chai-integer');
var moment = require('moment');

chai.use(assertArrays);
chai.use(assertIntegers);

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var User = require('../models/user.model');

describe('User schema validation tests on save or creating documents\n', function () {
    describe ('Admin flag validation tests\n', function () {
        describe.only ('Negative tests for admin flag:\n', function () {
            it ('should error when admin flag is set to null', function (done) {
                var user = new User ();
                var error;

                user.local.admin = null;
                error = user.validateSync();

                expect(error.errors['local.admin']).to.exist;
                expect(error.errors['local.admin'].message).to.exist;
                expect(error.errors['local.admin'].message).to.equal('Path `local.admin` is required.');
                expect(user.local.admin).to.not.exist;

                done();
            });

            it ('should error when admin flag is set to undefined', function (done) {
                var user = new User ();
                var error;

                user.local.admin = undefined;
                error = user.validateSync();

                expect(error.errors['local.admin']).to.exist;
                expect(error.errors['local.admin'].message).to.exist;
                expect(error.errors['local.admin'].message).to.equal('Path `local.admin` is required.');
                expect(user.local.admin).to.not.exist;

                done();
            });

            it ('should not error when an empty string is provided', function (done) {
                var user = new User ();
                var error;

                user.local.admin = '';
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.exist;
                expect(user.local.admin).to.equal(false);
                done();
            });
            it ('should not error when nothing is provided for admin flag', function (done) {
                var user = new User ();
                var error;

                user.local.admin;
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.exist;
                expect(user.local.admin).to.equal(false);
                done();
            });

            it ('should not error when random text is provided as admin value (not "true" and not "false")', function (done) {
                var user = new User ();
                var error;

                user.local.admin = 'your mama!';
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.exist;
                expect(user.local.admin).to.equal(true);
                done();
            });
            it ('should not error when zero is provided as admin value (not "true" and not "false")', function (done) {
                var user = new User ();
                var error;

                user.local.admin = 0;
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.exist;
                expect(user.local.admin).to.equal(false);
                done();
            });
            it ('should not error when zero is provided as admin value (string, not number)', function (done) {
                var user = new User ();
                var error;

                user.local.admin = '0';
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.exist;
                expect(user.local.admin).to.equal(false);
                done();
            });
        });
        describe.only ('Positive tests for admin flag:\n', function () {
            it ('should pass if admin flag is set to true (boolean)', function (done) {
                var user = new User ();
                var error;

                user.local.admin = true;
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.equal(true);
                done();
            });
            it ('should pass if admin flag is set to true (string)', function (done) {
                var user = new User ();
                var error;

                user.local.admin = 'true';
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.equal(true);
                done();
            });
            it ('should pass if admin flag is set to false (boolean)', function (done) {
                var user = new User ();
                var error;

                user.local.admin = false;
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.equal(false);
                done();
            });
            it ('should pass if admin flag is set to false (string)', function (done) {
                var user = new User ();
                var error;

                user.local.admin = 'false';
                error = user.validateSync();

                expect(error.errors['local.admin']).to.not.exist;
                expect(user.local.admin).to.equal(false);
                done();
            });
        });
    });
    describe ('Username validation tests\n', function () {
        describe ('Negative tests for username:\n', function () {
            it ('should return an error when an empty string is provided', function (done) {
                var user = new User ();
                var error;

                user.local.username = '';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.username'].message).to.equal('Username is required.');
                done();
            });

            it ('should return an error when valid and invalid characters are provided', function (done){
                var user = new User ();
                var error;

                user.local.username = '9495&&&66tyr88**$%^';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.username'].message).to.equal('9495&&&66tyr88**$%^ is not a valid username!');

                done();

            });

            it ('should return an error if only spaces are provided', function (done){
                var user = new User ();
                var error;
                user.local.username = '  ';

                error = user.validateSync();
                expect(error).to.exist;
                expect(error.errors['local.username'].message).to.equal('   is not a valid username!');
                done();
            });


            it ('should return an error if the maximum length for username is exceeded', function (done){
                var user = new User ();
                var error;
                user.local.username = 'Supercalifragilisticexpealadocious';

                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.username'].message).to.equal('Supercalifragilisticexpealadocious exceeds the maximum length permitted (20) for usernames.');
                done();
            });
        });
        describe('Positive tests for username:\n', function (){
            it('should return no errors for a username of one letter (uppercase)', function (done){
                var user = new User();
                var error;
                user.local.username = 'Z';

                error = user.validateSync();

                expect(error.errors['local.username']).to.not.exist;
                expect(user.local.username).to.equal('Z');
                done();
            });

            it ('should return no errors for a username of one letter (lowercase)', function (done){
                var user = new User();
                var error;

                user.local.username = 'q';
                error = user.validateSync();

                expect(error.errors['local.username']).to.not.exist;
                expect(user.local.username).to.equal('q');

                done();
            });

            it ('should return no errors for a username with numbers after the letter(s)', function (done){
                var user = new User();
                var error;

                user.local.username = 'MaryAnn59';
                error = user.validateSync();

                expect(error.errors['local.username']).to.not.exist;
                expect(user.local.username).to.equal('MaryAnn59');

                done();
            });

            it ('should return no errors for a username one letter and one number in it', function (done){
                var user = new User();
                var error;

                user.local.username = 'B6';
                error = user.validateSync();

                expect(error.errors['local.username']).to.not.exist;
                expect(user.local.username).to.equal('B6');

                done();
            });
        });
    });
    describe ('User First Name validation tests\n', function (){
        describe ('Negative tests for User first name:\n', function () {
            it ('should return an error when an empty string is provided', function (done) {
                var user = new User ();
                var error;

                user.local.uFirstName = '';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.uFirstName'].message).to.equal('First name is required.');
                done();
            });

            it ('should return an error when non-alpha or non-space characters are provided', function (done){
                var user = new User ();
                var error;

                user.local.uFirstName = '9495&&&66tyr//88**$%^';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.uFirstName'].message).to.equal('9495&&&66tyr//88**$%^ is not a valid first name!');

                done();

            });

            it ('should return an error if only spaces are provided', function (done){
                var user = new User ();
                var error;
                user.local.uFirstName = '  ';

                error = user.validateSync();
                expect(error).to.exist;
                expect(error.errors['local.uFirstName'].message).to.equal('   is not a valid first name!');
                done();
            });


            it ('should return an error if the maximum length for first name is exceeded', function (done){
                var user = new User ();
                var error;
                user.local.uFirstName = 'Supercalifragilisticexpealadocious';

                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.uFirstName'].message).to.equal('Supercalifragilisticexpealadocious exceeds the maximum length permitted (25) for first names.');
                done();
            });
        });
        describe('Positive tests for User first name:\n', function (){
            it('should return no errors for a first name of one letter (uppercase)', function (done){
                var user = new User();
                var error;
                user.local.uFirstName = 'Z';

                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uFirstName']).to.equal(undefined);
                expect(user.local.uFirstName).to.equal('Z');
                done();
            });

            it ('should return no errors for a first name of one letter (lowercase)', function (done){
                var user = new User();
                var error;

                user.local.uFirstName = 'q';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uFirstName']).to.equal(undefined);
                expect(user.local.uFirstName).to.equal('q');

                done();
            });

            it ('should return no errors for a first name with a space in it', function (done){
                var user = new User();
                var error;

                user.local.uFirstName = 'Mary Ann';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uFirstName']).to.equal(undefined);
                expect(user.local.uFirstName).to.equal('Mary Ann');

                done();
            });

            it ('should return no errors for a first name with a hyphen in it', function (done){
                var user = new User();
                var error;

                user.local.uFirstName = 'Banana-Rama';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uFirstName']).to.equal(undefined);
                expect(user.local.uFirstName).to.equal('Banana-Rama');

                done();
            });
        });
    });
    describe('User Last Name validation tests', function (){
        describe('Negative tests for User last name:\n', function (){
            it('should have an error if an empty string is provided', function (done){
                var user = new User;
                var error;

                user.local.uLastName = '';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.uLastName'].message).to.equal('Last name is required.');

                done();
            });

            it('should have an error if non-alpha or non-alpha plus white space characters are provided', function (done){
                var user = new User;
                var error;

                user.local.uLastName = '  ^&**#hfuUYG fjf!@@2!~';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.uLastName'].message).to.equal('  ^&**#hfuUYG fjf!@@2!~ is not a valid last name!');

                done();
            });

            it('should have an error if only white space is provided', function (done){
                var user = new User ();
                var error;

                user.local.uFirstName = '  ';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.uLastName'].message).to.equal('Last name is required.');

                done();
            });

            it('should have an error if the maximum length for last names is exceeded', function (done){
                var user = new User();
                var error;

                user.local.uLastName = 'SomewhereovertherainbowbluebirdsflywhyohwhycantI';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.uLastName'].message).to.equal('SomewhereovertherainbowbluebirdsflywhyohwhycantI'
                                                                + ' exceeds the maximum length permitted (45) for last names.');
                done();
            });
        });
        describe('Positive tests for User last name:\n', function () {
            it('should pass without error if uLastName has 1 alpha character (uppercase)', function (done){
                var user = new User();
                var error;

                user.local.uLastName = 'F';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uLastName']).to.equal(undefined);
                expect(user.local.uLastName).to.equal('F');

                done();
            });

            it('should pass without error if uLastName as 1 alpha character (lowercase)', function (done){
                var user = new User();
                var error;

                user.local.uLastName = 'c';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uLastName']).to.equal(undefined);
                expect(user.local.uLastName).to.equal('c');

                done();
            });

            it ('should pass without error if uLastName has a space in it', function (done){
                var user = new User();
                var error;

                user.local.uLastName = 'De Grave';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uLastName']).to.equal(undefined);
                expect(user.local.uLastName).to.equal('De Grave');

                done();
            });

            it ('should pass without error if uLastName has a hyphen in it', function (done){
                var user = new User();
                var error;

                user.local.uLastName = 'Huntington-Jones';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.uLastName']).to.equal(undefined);
                expect(user.local.uLastName).to.equal('Huntington-Jones');

                done();
            });

        });
    });
    describe('Password validation tests\n', function () {
        describe('Negative tests for password:\n', function () {
            it('should have an error less than 8 characters are passed', function (done){
                var user = new User();
                var error;

                user.local.password = 'abc-ab';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('abc-ab is not a valid password!');

                done();
            });

            it('should have an error if an empty string is passed as the password', function (done){
                var user = new User();
                var error;

                user.local.password = '';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal(' is not a valid password!');

                done();
            });

            it('should have an error if only lowercase letters are passed (min 8 char)', function (done){
                var user = new User();
                var error;

                user.local.password = 'abcdefghi';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('abcdefghi is not a valid password!');

                done();
            });

            it('should have an error if only uppercase letters are passed (min 8 char)', function (done){
                var user = new User();
                var error;

                user.local.password = 'ABCDEFGHIJ';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('ABCDEFGHIJ is not a valid password!');

                done();
            });

            it('should error if only digits (min 8) are passed', function (done){
                var user = new User();
                var error;

                user.local.password = '1234567890';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('1234567890 is not a valid password!');


                done();
            });

            it('should error if only special characters are passed (min 8 characters)', function (done){
                var user = new User();
                var error;

                user.local.password = '   ***(&^%)';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('   ***(&^%) is not a valid password!');

                done();
            });

            it ('should error if only spaces are provided (min 8)', function (done){
                var user = new User();
                var error;

                user.local.password = '        ';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('         is not a valid password!');

                done();
            });

            it ('should have an error if only lowercase and numbers are passed (min 8 chars)', function (done){
                var user = new User();
                var error;

                user.local.password = 'whatever99';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('whatever99 is not a valid password!');

                done();
            });

            it ('should error if only uppercase and numbers are passed (min 8 chars)', function (done){
                var user = new User();
                var error;

                user.local.password = 'WHATEVER299';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('WHATEVER299 is not a valid password!');

                done();
            });

            it ('should have an error if only numbers and special characters are passed (min 8 chars)', function (done){
                var user = new User();
                var error;

                user.local.password = '123*&^()0';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('123*&^()0 is not a valid password!');

                done();
            });

            it ('should error if if only letters (upper and lower) and special characters are passed (min 8 chars)', function (done){
                var user = new User();
                var error;

                user.local.password = 'WhaTeVer !@#$%';
                error = user.validateSync();

                expect(error).to.exist;
                expect(error.errors['local.password'].message).to.equal('WhaTeVer !@#$% is not a valid password!');

                done();
            });
        });
        describe('Positive tests for password:\n', function (){
            it('should pass with no errors for a password in proper format', function (done){
                var user = new User();
                var error;

                user.local.password = 'Banz-._ +Rama34';
                error = user.validateSync();

                expect(error).to.equal.null;
                expect(error.errors['local.password']).to.equal(undefined);
                expect(user.local.password).to.equal('Banz-._ +Rama34');

                done();
            });
        });
    });
    describe('Email Validation tests\n', function () {
        // NOTE: Per research, only the provider can validate emails. Therefore, little error
        // checking is going on here
        describe('Negative tests for email:\n', function () {
            it('should error if spaces are passed', function (done){
                var user = new User();
                var error;

                user.local.email = '   ';
                error = user.validateSync();

                expect(error).to.exist;
                expect(user.local.email).to.not.be.an.instanceof(String);
                expect(user.local.email).to.equal('   ');

                done();
            });

            it('should error when an empty string is passed', function (done){
                var user = new User();
                var error;

                user.local.email = '';
                error = user.validateSync();

                expect(error).to.exist;
                expect(user.local.email).to.not.be.an.instanceof(String);
                expect(user.local.email).to.equal('');


                done();
            });

        });

        describe('Positive tests for Email validation:\n', function (){
            it('should pass if a valid email is assgined', function (done){
                var user = new User();
                var error;

                user.local.email = 'jdegrave@earthlink.net';
                error = user.validateSync();


                expect(error.errors['local.email']).to.not.exist;
                expect(user.local.email).to.equal('jdegrave@earthlink.net');
                expect(user.local.email).to.be.a('string');

                done();
            });
        });
    });

    describe('User Created On Date Validation tests:\n', function(){
        describe('Negative tests for createdOn:\n ', function (){
            it ('should not error if nothing is entered\n', function (done){
                var user = new User ();
                var error;

                user.local.username = 'test';
                user.local.uFirstName = 'Test';
                user.local.uLastName = 'Tester';
                user.local.email = 'test@tester.com';
                user.local.password = 'what@#!ever00';

                error = user.validateSync();

                expect(error).to.not.exist;
                console.log('user.local.createdOn:' ,user.local.createdOn);
                expect(user.local.createdOn).to.be.a('date');
                done();
            });
        });
        describe('Positive tests for CreatedOn:\n ', function (){
            it('should accept 0 or more characters', function (done){
                var user = new User();
                var error;

                user.local.username = 'test';
                user.local.uFirstName = 'Test';
                user.local.uLastName = 'Tester';
                user.local.email = 'test@tester.com';
                user.local.password = 'what@#!ever00';
                user.local.createdOn = moment();

                error = user.validateSync();

                expect(error).to.not.exist;
                expect(user.local.createdOn).to.be.a('date');
                done();
            });
        });
    });

    // not sure if I'll need this or not for users...keeping in here for now
    describe('User String ObjectId validation tests:\n', function(){
        describe('Negative tests for stringObjectId:\n ', function (){
            it ('should pass if nothing is entered\n', function (done){
                var user = new User ();
                var error;

                user.stringObjectId;
                error = user.validateSync();

                expect(error.errors['stringObjectId']).to.not.exist;
                done();
            });
        });
        describe('Positive tests for stringObjectId:\n ', function (){
            it('this will be tested under userService.spec');
        });
    });
});
