var chai = require('chai');
var chaiHTTP = require('chai-http');
var expect = chai.expect;

var app = require('../index.js');

chai.use(chaiHTTP);
describe('homework 17 - user and members app', function (){
    describe('Routes', function(){
        describe('/', function(){
            it('should have status of 200 if successful', function(done){
                chai.request(app)   // this starts our server  - we pass our server to chai to test
                                    // make sure server IS NOT RUNNING or you'll get an error
                  .get('/')
                    .end(function (err, res){  // this fires off the request to the server
                      expect(err).to.be.null;
                      expect(res).to.have.status(200);
                      done();
                    });
            });
            it('should send welcome message if successful', function (done){
                chai.request(app)
                .get('/')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.be.html;
                        expect(res.text).to.equal('Welcome to Shamazon - the best site for buying all the things!')
                        done();
                    });
            });
        });
        describe('/GET', function(){
            it('should have a status of 404 for get requests that are not /users or /members', function(done){
                chai.request(app)
                .get('/notusers/ornotmembers')
                    .end(function (err, res){
                        expect(err).to.be.not.null;
                        expect(res).to.have.status(404);
                        expect(res.text).to.equal('Uh oh...we don\'t have any of those!');
                        done();
                    });
            });
            it('should display general error message', function(done){
                chai.request(app)
                .get('/notusers/ornotmembers')
                    .end(function (err, res){
                        expect(err).to.be.not.null;
                        expect(res).to.have.status(404);
                        expect(res.text).to.equal('Uh oh...we don\'t have any of those!');
                        done();
                    });
            });
        });
        describe('/POST', function(){
            it('should have a status of 403 for POST requests at the root route', function(done){
                chai.request(app)
                .post('/')
                .send( { id : 99, firstName : 'Jerry', lastName : 'Seinfeld', isMember: true})
                .end(function (err, res){
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(403);
                    expect(res.text).to.equal('Uh oh...POSTS to this level are verbotten');
                    done();
                });
            });
        });
        describe('/PUT', function(){
            it('should have a status of 403 for PUT requests at the root route', function(done){
                chai.request(app)
                .put('/')
                .send( { id : 3, firstName : 'Bob', lastName : 'Smiley', isMember: false })
                .end(function (err, res){
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(403);
                    expect(res.text).to.equal('Uh oh...PUT actions are not allowed at this level.');
                    done();
                });
            });
        });
        describe('/DELETE', function(){
            it('should have a status of 403 for DELETE requests at the root route', function(done){
                chai.request(app)
                .delete('/')
                .send( { id : 3, firstName : 'Bob', lastName : 'Smiley', isMember: false })
                .end(function (err, res){
                    expect(err).to.not.be.null;
                    expect(res).to.have.status(403);
                    expect(res.text).to.equal('No deletions allowed!');
                    done();
                });
            });
        });

        describe('/users', function(){
            it('should have a status of 200 if successful', function(done){
                chai.request(app)
                .get('/users')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res).to.be.an.array;
                        expect(res).to.contain.an.object;
                        done();
                    });
            });
            it('should display general error message for any other GET request for /users', function(done){
                chai.request(app)
                .get('/users/feet')
                    .end(function (err, res){
                        expect(err).to.not.be.null;
                        expect(res).to.have.status(404);
                        expect(res.text).to.equal('Uh oh...we don\'t have any of those!');
                        done();
                    });
            });




        });
    });
});
