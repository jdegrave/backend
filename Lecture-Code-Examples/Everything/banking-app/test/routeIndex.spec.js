var chai = require('chai');
var expect = chai.expect;
var chaiHTTP = require('chai-http');

var app = require('../index.js');
chai.use(chaiHTTP);

describe('Routes validation tests for banking app:\n', function (){
    describe('GET routes:\n', function () {
        describe('GET /deposits:\n', function (){
            it('should return the sum of all deposits in the bank:\n', function (done){
                chai.request(app)
                    .get('/deposits')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.be.a.number;
                        done();
                    });
            });
        });
        describe('GET /payments:\n', function (){
            it('should return the sum of all payments in the bank:\n', function (done){
                chai.request(app)
                    .get('/payments')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.be.a.number;
                        done();
                    });
            });
        });

        describe('GET /withdrawals:\n', function (){
            it('should return the sum of all withdrawals in the bank:\n', function (done){
                chai.request(app)
                    .get('/withdrawals')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.be.a.number;
                        done();
                    });
            });
        });
        describe('GET /outgoingcash:\n', function (){
            it('should return the sum of cash going out of the bank:\n', function (done){
                chai.request(app)
                    .get('/outgoingcash')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.be.a.number;
                        done();
                    });
            });
        });
        describe('GET /outgoingcash/alt:\n', function (){
            it('should return the sum of cash going out of the bank (uses alternate function):\n', function (done){
                chai.request(app)
                    .get('/outgoingcash/alt')
                    .end(function (err, res){
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res).to.be.a.number;
                        done();
                    });
            });
        });

    });
});
