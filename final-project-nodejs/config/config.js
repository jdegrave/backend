//var dotenv = require('dotenv');
var cfg = {};

// From Twilio demo
// if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
//   dotenv.config({path: '.env'});
// } else {
//   dotenv.config({path: '.env.test', silent: true});
// }

// Environment
//dotenv.config({path: '.env'});


// HTTP Port to run our web application
cfg.port = process.env.PORT || 8080;


// A random string that will help generate secure one-time passwords and
// HTTP sessions
cfg.secret = process.env.APP_SECRET || 'purple keyboard animals';

// Your Twilio account SID and auth token, both found at:
// https://www.twilio.com/user/account

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
var isConfigured = requiredConfig.every(function (configValue) {
    return configValue || false;
});

if (!isConfigured) {
    var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';

    throw new Error(errorMessage);
}

// Export configuration object
module.exports = cfg;
