var mongoose = require('mongoose');
var Schema =  mongoose.Schema;
var userSchema = new Schema({
    github: {
                id: String,
                username: String,
                publicRepos: Number  // comes with Github. Could just use id, or id and username, etc.
            }
    //add additional strategies
    // facebook: {
    //          },
    // google: {
    //          }
    //}
});

module.exports = mongoose.model('User', userSchema);
