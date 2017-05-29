var chai = require('chai');
var expect = chai.expect;    // so we can say 'expect' instead of 'chai.expect' - shorthand
var chaiHTTP = require('chai-http');

chai.use(chaiHTTP);// use the chaiHTTP library
var app = require('../index.js');



describe.skip('Final Project - Node.js - Index.js file:\n', function () {
    describe('Front End API endpoints test\n', function (){
        describe ('GET requests: Login\n', function (){
            describe('/\n', function (){
                it('should display the login page', function (done){
                    chai.request(app)
                    .get('/')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.text).to.equal('Welcome to Robo-SMS! Please login!');
                        done();
                    });
                });
            })
        });
        describe ('GET requests: Drivers:\n', function () {
            describe ('/drivers:\n', function () {
                it('should have status code of 200 when successful', function(done) {
                    chai.request(app)
                        .get('/drivers')
                        .end(function (err, res){
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            done();
                        });
                });

                it('should have status code of 404 when unsuccessful', function(done) {
                    chai.request(app)
                        .get('/whatever')
                        .end(function (err, res){
                            expect(err).to.not.be.null
                            expect(res).to.have.status(404)
                            done();
                        });
                });
            });
        });
        describe ('POST requests: Updating Driver Availability, Text Capability, and Schedule Notes:\n', function (){
            describe('POST: Updating Driver Availability:\n', function (){
                it('should save a change to driver availabity to the database:\n', function (done){
                    chai.request(app)
                        .post('/drivers/update1')
                        .send({
                                    "_id": "58d3f839936b0405bcda9bcb",
                                    "__v": 0,
                                    "firstName": "Bob",
                                    "lastName": "Olson",
                                    "mobilePhone": "479-802-8744",
                                    "deleted": false,
                                    "text": false,
                                    "firstToText": false,
                                    "scheduleNote": [],
                                    "seniorityRank": 6,
                                    "available": true
                                })
                        .end(function (err, res){
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            done();
                        });

                });
            });
        });
        describe ('GET requests: Present Trip Tab:\n', function () {
            describe ('/trips:\n', function () {
                it('should have status code of 200 when successful', function(done) {
                    chai.request(app)
                        .get('/drivers')
                        .end(function (err, res){
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            done();
                        });
                });

                it('should have status code of 404 when unsuccessful', function(done) {
                    chai.request(app)
                        .get('/trips/funkty')
                        .end(function (err, res){
                            expect(err).to.not.be.null
                            expect(res).to.have.status(404)
                            done();
                        });
                });
            });
        });
        describe ('POST requests: Trips:\n', function (){
            describe('POST: Creating the trip:\n', function (){
                it('should create and save a trip to the database and redirect to trips\:tripObjectId:\n', function (done){
                    chai.request(app)
                        .post('/trips')
                        .send ({
                            cityCode : 'LCL',
                            driverQuota : '6',
                            startDate: '2017-07-23',
                            startTime: '16:30'
                        })
                        .end(function (err, res) {
                            expect(err).to.be.null;
                            expect(res).to.have.status(301);
                            done();
                        });

                });
                it('should fail and not create a trip or save it to the database', function (done){
                    chai.request(app)
                        .post('/trips')
                        .send ({
                            cityCode : '',
                            driverQuota : '6',
                            startDate: '2017-07-23',
                            startTime: '16:30'
                        })
                        .end(function (err, res) {
                            expect(err).to.exist;
                            expect(res).to.have.status(500);
                            done();
                        });

                });
            });
        });
        describe('POST requests redirect: Trips:id\n', function (){
            describe('POST: Redirecting after trip creation and displaying status/dashboard page:\n', function (){
                it('should fail and not create a trip or save it to the database', function (done){
                    chai.request(app)
                        .post('/trips/thisiSANOTATRIPID')
                        .end(function (err, res) {
                            expect(err).to.exist;
                            expect(res).to.have.status(404);
                            done();
                        });

                });
            });
        });
        describe('POST requests test sms /test/sms \n', function (){
            describe('POST: Evaluate driver responses (or non responses) and send reply or not:\n', function (){
                it('should fail if an invalid phone number and reply are submitted', function (done){
                    chai.request(app)

                        .post('/test/sms')
                        .send({from : '+1477785', body : '1'})
                        .end(function (err, res) {
                            expect(err).to.exist;
                            expect(res).to.have.status(500);
                            done();
                        });

                });
            });
        });
    });

    describe.skip('Backend Only API endpoints tests: \n', function (){
        describe('GET requests: Drivers\n', function (){
            describe('/drivers/id/:id \n', function(){
                it('if driver id isn\'t provided,should return a status of 404 ', function (done) {

                    chai.request(app)
                        .get('/drivers/id/')
                        .end(function (err, res){
                            expect(err).to.not.be.null;
                            expect(res).to.have.status(404);
                            done();
                        });
                });
                it('if driver id isn\'t valid,should return a status of 404 ', function (done) {

                    chai.request(app)
                        .get('/drivers/4')
                        .end(function (err, res){
                            expect(err).to.not.be.null;
                            expect(res).to.have.status(404);
                            done();
                        });
                });
                it('if driver exists, should return a status of 200 ', function (done) {

                    chai.request(app)
                        .get('/driver/id/58d3f839936b0405bcda9bd7')
                        .end(function (err, res) {
                            expect(err).to.be.null;
                            expect(res).to.have.status(200);
                            done();
                        });
                });
            });
        });
    });
});
