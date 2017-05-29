//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.model');




module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });


    // =========================================================================
    // LOCAL SIGNUP =============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        // asynchronous
        process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {

                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set the user's local credentials
                    console.log('adminCheck: ', req.body.adminCheck);
                    if (req.body.adminCheck == undefined || req.body.adminCheck == null) {
                        req.body.adminCheck = false;
                    }
                    console.log('adminCheck: ', req.body.adminCheck);
                    newUser.local.admin = req.body.adminCheck;
                    newUser.local.username = req.body.username;
                    newUser.local.uFirstName = req.body.uFirstName;
                    newUser.local.uLastName = req.body.uLastName;
                    newUser.local.email = req.body.email;
                    newUser.local.password = newUser.generateHash(req.body.password);
                    console.log('newUser.local.password after hash: ', newUser.local.password);
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                } // end else

            }); // end User.findOne

        }); // end process.nextTick

    })); // end Local-Login Strategy

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // Using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'User not found.'));

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Incorrect Password. Try again.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        }); // end User.findOne

    })); // end local-login Strategy

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    // not yet implemented - need to check Heroku,Google, and passport docs

    //
    // passport.use(new GoogleStrategy({
    //         clientID : process.env.GOOGLE_CLIENT_ID,
    //         clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    //         callbackURL : process.env.GOOGLE_CALLBACK_URL
    //     },
    //
    //     function (token, refreshToken, profile, done) {
    //
    //     // make the code asynchronous
    //     // User.findOne won't fire until we have all our data back from Google
    //     process.nextTick(function() {
    //
    //         // try to find the user based on their google id
    //         User.findOne({ 'google.id' : profile.id }, function(err, user) {
    //             if (err)
    //                 return done(err);
    //
    //             if (user) {
    //
    //                 // if a user is found, log them in
    //                 return done(null, user);
    //             } else {
    //                 // if the user isnt in our database, create a new user
    //                 var newUser = new User();
    //
    //                 // set all of the relevant information
    //                 newUser.google.id    = profile.id;
    //                 newUser.google.token = token;
    //                 newUser.google.name  = profile.displayName;
    //                 newUser.google.email = profile.emails[0].value; // pull the first email
    //
    //                 // save the user
    //                 newUser.save(function(err) {
    //                     if (err)
    //                         throw err;
    //                     return done(null, newUser);
    //                 });
    //             }
    //         });
    //     });
    //
    // })); // end new GoogleStrategy

};  // end module.exports
