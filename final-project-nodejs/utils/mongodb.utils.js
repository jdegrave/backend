
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;  // use node.js promises

module.exports = {
                    createEventListeners : createEventListeners,
                    connect : connect,
                    disconnect : disconnect
                };


function createEventListeners () {
    mongoose.connection.on('connected', function () {
        console.log('Successfully connected to Robo-SMS database.');
    });

    mongoose.connection.on('disconnected', function () {
        console.log('Database connection to Robo-SMS closed.');
    });

    mongoose.connection.on('error', function (err) {
        console.log('There was an issue connecting to the Robo-SMS database: ' + err);
    });
}

function connect () {
    //mongoose.connect('mongodb://localhost/robotest');
    //mongoose.connect('mongodb://localhost/alphatest');
    mongoose.connect('mongodb://localhost/jodi-only');
    //mongoose.connect('mongodb://localhost/special-test');
    //mongoose.connect(process.env.MONGODB_URI);
}

function disconnect () {
    mongoose.disconnect();
}
