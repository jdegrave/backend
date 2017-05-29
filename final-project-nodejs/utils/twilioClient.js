var config = require('../config/config');
var client = require('twilio')(config.accountSid, config.authToken);



module.exports.sendSms = function(to, message) {
  client.messages.create({
    body: message,
    to: to,
    from: config.sendingNumber
  }, function(err, data) {
    if (err) {
      console.error('Could not contact driver');
      console.error(err);
    } else {
      console.log('Message sent.');
    }
  });
};
