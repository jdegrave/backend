// passport calls using Facebook and Google, and Git authentication 'strategies'
var GitHubStrategy = require('passport-github2').Strategy;

// after setting Mongoose model for users in DB
var User = require('../models/user.model');

// create an object to contain the info we send to GitHub and what GitHub gives to us
// property names are per GitHub OAuth documentation
var githubAuth = {
    clientID: '43d76b4888334542f06d',   // don't put these on github!
    clientSecret: 'b50843d474deea3d4b3486fa3fb05fd9262f5a00',
    callbackURL: 'http://localhost:3000/login/callback'
};

// export this configuration as a function that the main server file can execute
// only want only 1 instance of passport running
// We will set up the passport object and initialize it

module.exports = function (passport) {
// this is the passport configuration code. This is serilaize and deserialize (which
// means to turn it into a string and then converting it back into an object). passport
// will seriliaze it

    passport.serializeUser(function (user, done) {  // user is an object, done is a function
        done(null, user);  // serilaizes users and passes back a string
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);     // obj is a javascript object
    });

    // tell passport to use GitHub Strategy
    passport.use(new GitHubStrategy(githubAuth, findOrCreateUser));

    function findOrCreateUser (accessToken, refreshToken, profile, done) {
        // done is a passport function; the other three (accessToken, refreshToken, profile) ore GitHub
        // strategy things
        var query = { 'github.id' : profile.id };
        var updates = {
            $setOnInsert: {
                'github.username' : profile.username,
                'github.publicRepos' : profile._json.public_repos   // red is GitHub repository website - the yellow is our database
            }
        };

        var options = { upsert : true, new : true }; // new will return the created object - otherwise it just returns null

        return User.findOneAndUpdate(query, updates, options)
            .then(function (result){
                return done(null, result);
            }).catch(function  (err){
                return done(err, null);
            });
    }
};
