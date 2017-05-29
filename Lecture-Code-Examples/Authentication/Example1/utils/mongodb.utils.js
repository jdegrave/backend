var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  // use node.js promises

module.exports = {
                    createEventListeners : createEventListeners,
                    connect : connect,
                    disconnect : disconnect
                };


function createEventListeners () {
    mongoose.connection.on('connected', function () {
        console.log('Successfully connected to authdemo database.');
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Database connection to authdemo database closed.');
    });

    mongoose.connection.on('error', function (err) {
        console.log('There was an issue connecting to authdemo database: ' + err);
    });
}

function connect () {
    mongoose.connect('mongodb://localhost/authdemo');
}

function disconnect () {
    mongoose.disconnect();
}
