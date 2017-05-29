var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  // use node.js promises

module.exports = {
                    createEventListeners : createEventListeners,
                    connect : connect,
                    disconnect : disconnect
                };


function createEventListeners () {
    mongoose.connection.on('connected', function () {
        console.log('Successfully connected to Blake\'s Bank database.');
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Database connection to Blake\'s Bank closed.');
    });

    mongoose.connection.on('error', function (err) {
        console.log('There was an issue connecting to Blake\'s Bank database: ' + err);
    });
}

function connect () {
    mongoose.connect('mongodb://localhost/bankofblake');
}

function disconnect () {
    mongoose.disconnect();
}
