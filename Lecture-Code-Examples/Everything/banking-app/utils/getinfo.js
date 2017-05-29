var mongodb = require('./mongodb.utils.js');
var request = require('request');
var rp = require('request-promise');
var accountServices = require('../services/account.services');


//function getBankData() {

var headers = {
            //'Content-type' : 'application/json',  not needed for request module  - only have to do it with plain node
            'BANK-OF-BLAKE-AUTH' : '8bfde0b5-307d-4621-b032-b82643fc2420'
        };


var options = {
                url:  'https://bob-legacy.appspot.com/ledger',
                method: 'GET',
                headers: headers,
                json: true
            };
//request-promise takes care of this automatically!
    // return new Promise (function (resolve, reject){
    //     request(options, function (error, response, body){
    //         if (error || response.statusCode !== 200) {
    //             reject (error);
    //
    //         } else {
    //             resolve(body);
    //         }
    //     }); // end of request
    // }); // end of promise
//} // END OF FUNCTION
mongodb.createEventListeners();
mongodb.connect();

rp(options).then(function(bankInfo){
    //must return something in order to chain it
    return accountServices.saveAllAccounts(bankInfo);
}).then(function(){
    mongodb.disconnect();
}).catch(function(err){
    console.log('there was an error disconnecting from the database.');
});
