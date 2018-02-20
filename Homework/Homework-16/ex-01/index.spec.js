// this file could have been named 'test.spec.js' instead of 'index.spec.js'
// This exercise uses mocha, chai, and chai-http to test asynch calls

var chai = require('chai');
var chaiHTTP = require('chai-http');
var expect = chai.expect;       // this makes it possible to use 'expect' instead of 'chai.expect'

// imports our app that we exported so we can test it
var app = require('./index');

// tells chai to use the chaiHTTP library. It will gives us functions to use
// http calls in our tests
chai.use(chaiHTTP);

describe('Routes', function (){
    describe('/', function (){
        describe('GET Request', function () {
            // remember to include 'done() as the callback function so it will wait until the get completes'
            it('should return response status 200 when succesful', function (done){
                // starts the server - we pass our server to chai to test - make sure server
                // IS NOT RUNNING or this next line will cause an error
                chai.request(app)
                    .get('/')
                    .end(function(err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        done();
                });
            });

            it('should contain correct response when successful', function (done){
                // means use this code to test - it has our routes in it to get the response
                chai.request(app)
                    .get('/')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.be.html;
                        expect(res.text).to.equal('Welcome to City List');
                        done();
                });
            });
        });
    });

    describe('/cities', function(){
        describe('GET request - root', function (){
            it('should have status 200 when successful', function (done){
                chai.request(app)
                    .get('/cities')
                    .end(function(err, res) {
                        expect(err).to.be.null;
                        expect(res).to.be.json;
                        expect(res).to.have.status(200);
                        done();
                });
            });

            it('should return all cities in array when successful', function (done){
                chai.request(app)
                    .get('/cities')
                    .end(function(err, res) {
                        expect(res).to.exist;
                        expect(res).to.be.json;
                        expect(res).to.be.an.array;
                        expect(res).to.contain.an.object;
                        done();
                });
            });
        });

        describe('GET request: get city by city name', function (){
            it('should return first city with matching city name when successful', function (done){
                var name = {id: 1, city: 'Springdale', state: 'AR', almanac: 'true'};
                chai.request(app)
                    .get('/cities/Springdale') // add city here - make it identical to get request in postman
                    .end(function(err, res){
                        //console.log(res.body);
                        expect(err).to.be.null;
                        expect(res).to.be.json;
                        expect(res).to.be.an.object;
                        expect(res).to.not.be.empty;
                        expect(res).to.not.equal(undefined);
                        expect(res.json).to.equal(undefined);
                        expect(res).to.not.equal('');
                        expect(res.body).to.deep.equal(name);
                        done();
                    });
            });
        });

        describe('POST request: add a city', function (){
            it('should add a new city', function (done){
                chai.request(app)
                    .post('/cities')
                    .send({ id: 6, city: 'Chicago', state: 'IL', almanac: 'true' })
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body).to.deep.equal({ id: 6, city: 'Chicago', state: 'IL', almanac: 'true' });
                        done();
                    });
            });

        });
    });
});
