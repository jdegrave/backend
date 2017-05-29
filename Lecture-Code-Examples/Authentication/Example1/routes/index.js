var isLoggedIn = require('../middleware/is-logged-in.mw');


// we need to use a higher order function to pass passport to all of our routes
module.exports = function (passport) {
    var router = require('express').Router();

    router.get('/', function (req, res) {
        // process.cwd()  <-- creates an absolute path from where we run node from
        // process.cwd ()  == process.current working directory
        // you could also use __dirname + /file
        res.status(200).sendFile(process.cwd() + '/assets/index.html');

    });

    router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

    router.get(
        '/login/callback',
        passport.authenticate('github', { failureRedirect: '/'}),
        function (req, res){ res.redirect('/secrets');
    });

    // if all goes well, we can go to the secrets page
    // we run the middleware and then it does it's thing!
    router.get('/secrets', isLoggedIn, function (req, res){
        res.status(200).sendFile(process.cwd() + '/assets/secrets.html');
    });

    router.get('/logout', function (req, res){
        req.logout();
        res.redirect('/');
    })

    return router;
}
