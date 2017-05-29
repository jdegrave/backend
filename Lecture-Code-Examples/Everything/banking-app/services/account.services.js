var mongodb = require('../utils/mongodb.utils');
var Account = require('../models/account.model');

module.exports = {
    saveAllAccounts : saveAllAccounts,
    sumOfDeposits : sumOfDeposits,
    sumOfPayments : sumOfPayments,
    sumOfWithdrawals : sumOfWithdrawals,
    sumOfOutGoing : sumOfOutGoing,
    sumofPaymentsAndWithdrawals : sumofPaymentsAndWithdrawals

};

function saveAllAccounts (accountsToSeed) {
    return Account.insertMany(accountsToSeed);
}

function sumOfDeposits () {
    return Account.aggregate([{ $match: { type : "deposit" }},
                            { $group: { _id: null,  totalDeposits: { $sum: "$amount" }}} ]);
}

function sumOfPayments () {
    return Account.aggregate([{ $match: { type : "payment" }},
                            { $group: { _id: 0,  totalPayments: { $sum: "$amount" }}} ]);
}

function sumOfWithdrawals () {
    return Account.aggregate([{ $match: { type : "withdrawal" }},
                            { $group: { _id: 0,  totalWithdrawals: { $sum: "$amount" }}} ]);
}

function sumOfOutGoing () {
    return Account.aggregate([ { $match: { $or: [{ type: 'payment' }, { type: 'withdrawal' }] }},
                            { $group: { _id: 0,  totalPayments: { $sum: "$amount" }}} ]);
}

function sumofPaymentsAndWithdrawals () {
    return Promise.all([ sumOfPayments(), sumOfWithdrawals() ]);
}
