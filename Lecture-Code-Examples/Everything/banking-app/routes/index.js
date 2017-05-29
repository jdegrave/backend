var router = require('express').Router();
var accountServices = require('../services/account.services');


router.get('/deposits', function (req, res) {
    accountServices.sumOfDeposits().then(function(deposits){
        res.status(200).json(deposits);
    }).catch(function(err){
        res.status(500).send('Internal server error');
    });
});

router.get('/payments', function (req, res) {
    accountServices.sumOfPayments().then(function(payments){
        res.status(200).json(payments);
    }).catch(function(err){
        res.status(500).send('Internal server error');
    });
});

router.get('/withdrawals', function (req, res) {
    accountServices.sumOfWithdrawals().then(function(withdrawals){
        res.status(200).json(withdrawals);
    }).catch(function(err){
        res.status(500).send('Internal server error');
    });
});

router.get('/outgoingcash', function (req, res) {
    accountServices.sumofPaymentsAndWithdrawals().then(function(allOutGoingCash){
        var totalPayments = allOutGoingCash[0][0];
        var totalWithdrawals =  allOutGoingCash[1][0];
        var totalOutCash = totalPayments.totalPayments + totalWithdrawals.totalWithdrawals;

        res.status(200).json(totalOutCash);
    }).catch(function(err){
        res.status(500).send('Internal server error');
    });
});

router.get('/outgoingcash/alt', function (req, res) {
    accountServices.sumOfOutGoing().then(function(totalOutCash){
        res.status(200).json(totalOutCash);
    }).catch(function(err){
        res.status(500).send('Internal server error');
    });
});

module.exports = router;
