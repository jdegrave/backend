var router = require('express').Router();  // import Express router object

//animal routes
var cats = require('./cats');
var elephants = require('./elephants');
var rabbits = require('./rabbits');
var birds = require('./birds');
var monkeys = require('./monkeys');

router.get('/', function (request, response){
    response.status(200).send('Welcome to the Menagerie!');
});

router.use('/cats', cats);
router.use('/elephants', elephants);
router.use('/rabbits', rabbits);
router.use('/birds', birds);
router.use('/monkeys', monkeys);


// general error handling
router.get('*', function(request, response) {
    response.status(404).send('Sorry - we don\'t have any of those!');
});

router.post('*', function(request, response) {
    response.status(403).send('No general updates via POST permitted.');
});

router.put('*', function(request, response) {
    response.status(403).send('No general updates via PUT permitted.');
});

router.delete('*', function (request, response) {
    response.status(403).send('No general deletions via DELETE permitted at this level.');
});

module.exports = router;
