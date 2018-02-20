var router = require('express').Router();
var almanac = require('./almanac');
var astronomy = require('./astronomy');

router.get('/', function (req, res){
    //Express lets you chain certain methods
    res.status(200).send('Welcome to the Weather App!');
});

router.use('/almanac', almanac);
router.use('/astronomy', astronomy);

router.get('*', function (req, res){
  res.status(404).send('Uh-oh. Not found.');
});

// router.post('*', function(req, res){
//   res.status(404).send('Nothing here...');
// });
//
// router.put('*', function(req, res){
//   res.status(404).send('Nothing here...');
// });
//
// router.delete('*', function(req, res){
//   res.status(404).send('Yikes! No deletions permitted!');
// });
module.exports = router;
