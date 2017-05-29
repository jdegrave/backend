var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
    amount : Number,
    date : Date,
    business : String,
    name: String,
    type: String,
    account: String
});

module.exports = mongoose.model('Account', accountSchema);
