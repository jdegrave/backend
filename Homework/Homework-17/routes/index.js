var router = require('express').Router();
var users = require('./users');
var members = require('./members.js');


router.use('/users', users);
router.use('/members', members);

router.get('/', function(req, res) {
    res.status(200).send('Welcome to Shamazon - the best site for buying all the things!');
});





router.get('*', function (req, res){
    res.status(404).send('Uh oh...we don\'t have any of those!');
});


router.post('*', function (req, res){
    res.status(403).send('Uh oh...POSTS to this level are verbotten');
});


router.put('*', function (req, res){
    res.status(403).send('Uh oh...PUT actions are not allowed at this level.');
});


router.delete('*', function (req, res){
    res.status(403).send('No deletions allowed!');
});
module.exports = router;
